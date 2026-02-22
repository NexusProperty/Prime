import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const CHECKS = {
  SITE_SILENCE_HOURS: 2,
  VOLUME_SPIKE_MULTIPLIER: 3,
  FAILURE_SPIKE_THRESHOLD: 5,
  FAILURE_SPIKE_MINUTES: 15,
} as const

type Alert = {
  type: string
  severity: 'warning' | 'critical'
  message: string
  data: Record<string, unknown>
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authHeader = req.headers.get('Authorization')
  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey)
  const start = Date.now()
  const alerts: Alert[] = []

  // Idempotency cycle key — deduplicate within the same 15-min window
  const cycle = Math.floor(Date.now() / (15 * 60 * 1000))

  // 1. Fetch agent row for logging
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('name', 'data_monitor')
    .maybeSingle()

  // 2. Fetch all active sites
  const { data: sites } = await supabase
    .from('sites')
    .select('id, name, url')
    .eq('is_active', true)

  // ── CHECK 1: Site silence ─────────────────────────────────────────────────
  if (sites) {
    const silenceCutoff = new Date(
      Date.now() - CHECKS.SITE_SILENCE_HOURS * 60 * 60 * 1000,
    ).toISOString()

    for (const site of sites) {
      const { count } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id)
        .gte('created_at', silenceCutoff)

      if ((count ?? 0) === 0) {
        alerts.push({
          type: 'site_silence',
          severity: 'warning',
          message: `"${site.name}" has sent no events in the last ${CHECKS.SITE_SILENCE_HOURS}h`,
          data: { site_id: site.id, site_name: site.name, site_url: site.url },
        })
      }
    }
  }

  // ── CHECK 2: Event volume spike ───────────────────────────────────────────
  if (sites) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    for (const site of sites) {
      const { count: recentCount } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id)
        .gte('created_at', twoHoursAgo)

      const { count: weekCount } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .eq('site_id', site.id)
        .gte('created_at', sevenDaysAgo)

      // 7 days = 84 × 2-hour windows
      const avgPer2h = (weekCount ?? 0) / 84
      const spike = avgPer2h * CHECKS.VOLUME_SPIKE_MULTIPLIER

      if (avgPer2h > 0 && (recentCount ?? 0) > spike) {
        alerts.push({
          type: 'volume_spike',
          severity: 'warning',
          message: `"${site.name}" volume spike: ${recentCount} events/2h vs ${avgPer2h.toFixed(1)} avg (${CHECKS.VOLUME_SPIKE_MULTIPLIER}× threshold = ${spike.toFixed(1)})`,
          data: {
            site_id: site.id,
            site_name: site.name,
            recent_count: recentCount,
            avg_per_2h: avgPer2h,
            spike_threshold: spike,
          },
        })
      }
    }
  }

  // ── CHECK 3: Agent failure spike ──────────────────────────────────────────
  const failureCutoff = new Date(
    Date.now() - CHECKS.FAILURE_SPIKE_MINUTES * 60 * 1000,
  ).toISOString()

  const { count: failureCount } = await supabase
    .from('agent_actions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'failed')
    .gte('created_at', failureCutoff)

  if ((failureCount ?? 0) >= CHECKS.FAILURE_SPIKE_THRESHOLD) {
    alerts.push({
      type: 'agent_failure_spike',
      severity: 'critical',
      message: `${failureCount} agent failures in the last ${CHECKS.FAILURE_SPIKE_MINUTES}min (threshold: ${CHECKS.FAILURE_SPIKE_THRESHOLD})`,
      data: {
        failure_count: failureCount,
        threshold: CHECKS.FAILURE_SPIKE_THRESHOLD,
        window_minutes: CHECKS.FAILURE_SPIKE_MINUTES,
      },
    })
  }

  const duration = Date.now() - start

  // ── Log each alert to agent_actions ──────────────────────────────────────
  if (agent?.id && alerts.length > 0) {
    const inserts = alerts.map((alert, i) => ({
      agent_id: agent.id,
      action_type: 'alert_sent',
      input: { check_type: alert.type, cycle },
      output: { severity: alert.severity, message: alert.message, data: alert.data },
      status: 'escalated' as const,
      confidence: 1.0,
      duration_ms: duration,
      idempotency_key: `dm-${alert.type}-${('data' in alert && 'site_id' in alert.data ? String(alert.data.site_id) : String(i))}-${cycle}`,
    }))
    await supabase.from('agent_actions').insert(inserts)
    console.warn('[data-monitor] ALERTS RAISED:', alerts.length, JSON.stringify(alerts.map((a) => a.message)))
  }

  // ── Log all-clear when no alerts ─────────────────────────────────────────
  if (agent?.id && alerts.length === 0) {
    await supabase.from('agent_actions').insert({
      agent_id: agent.id,
      action_type: 'health_check',
      input: { checks_run: 3, cycle },
      output: { status: 'all_clear', sites_checked: sites?.length ?? 0 },
      status: 'success',
      confidence: 1.0,
      duration_ms: duration,
      idempotency_key: `dm-clear-${cycle}`,
    })
  }

  const report = {
    checked_at: new Date().toISOString(),
    duration_ms: duration,
    sites_checked: sites?.length ?? 0,
    checks_run: 3,
    alerts_raised: alerts.length,
    alerts,
  }

  console.log(
    `[data-monitor] sites=${sites?.length ?? 0} alerts=${alerts.length} duration=${duration}ms`,
  )

  return new Response(JSON.stringify(report), {
    headers: { 'Content-Type': 'application/json' },
  })
})
