import { z } from 'npm:zod@3';

export const BrandSchema = z.enum(['prime', 'akf', 'cleanjet']);
export type Brand = z.infer<typeof BrandSchema>;

export const CallSchema = z.object({
  id: z.string(),
  assistantId: z.string().optional(),
  orgId: z.string().optional(),
  type: z.enum(['inboundPhoneCall', 'outboundPhoneCall', 'webCall']).optional(),
  customer: z.object({
    number: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
});

export const FunctionCallEventSchema = z.object({
  message: z.object({
    type: z.literal('function-call'),
    call: CallSchema,
    functionCall: z.object({
      name: z.string(),
      parameters: z.record(z.unknown()),
    }),
    toolCallList: z.array(z.object({
      id: z.string(),
      function: z.object({
        name: z.string(),
        arguments: z.string(),
      }),
    })).optional(),
  }),
});
export type FunctionCallEvent = z.infer<typeof FunctionCallEventSchema>;

export const EndOfCallReportSchema = z.object({
  message: z.object({
    type: z.literal('end-of-call-report'),
    call: CallSchema,
    transcript: z.string().optional(),
    summary: z.string().optional(),
    recordingUrl: z.string().url().optional(),
    durationSeconds: z.number().optional(),
    endedReason: z.string().optional(),
    analysis: z.object({
      summary: z.string().optional(),
      structuredData: z.record(z.unknown()).optional(),
    }).optional(),
  }),
});
export type EndOfCallReport = z.infer<typeof EndOfCallReportSchema>;

export const StatusUpdateSchema = z.object({
  message: z.object({
    type: z.literal('status-update'),
    call: CallSchema,
    status: z.enum(['queued', 'ringing', 'in-progress', 'forwarding', 'ended']),
  }),
});

export const AssistantRequestSchema = z.object({
  message: z.object({
    type: z.literal('assistant-request'),
    call: CallSchema,
  }),
});

export const HangSchema = z.object({
  message: z.object({
    type: z.literal('hang'),
    call: CallSchema,
  }),
});

export const VapiEventSchema = z.union([
  FunctionCallEventSchema,
  EndOfCallReportSchema,
  StatusUpdateSchema,
  AssistantRequestSchema,
  HangSchema,
  z.object({ message: z.object({ type: z.string() }) }),
]);

export const ToolCallResponseSchema = z.object({
  results: z.array(z.object({
    toolCallId: z.string().min(1),
    result: z.string(),
  })),
});
export type ToolCallResponse = z.infer<typeof ToolCallResponseSchema>;

export const CaptureLeadParamsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  service_type: z.string().optional(),
  message: z.string().optional(),
  urgency: z.enum(['normal', 'urgent', 'emergency']).default('normal'),
});

export const SearchKnowledgeBaseParamsSchema = z.object({
  query: z.string().min(1),
});

export const CheckEmergencyParamsSchema = z.object({
  situation: z.string().min(1),
});

export const CrossSellPitchParamsSchema = z.object({
  lead_id: z.string().optional(),
  target_brand: z.enum(['akf', 'cleanjet', 'prime']),
  reason: z.string().min(1),
});

export const SendFollowupSmsParamsSchema = z.object({
  to_number: z.string().min(6),
  message_type: z.enum(['quote_request', 'booking_confirmation', 'emergency_followup']),
});

export const GetQuoteEstimateParamsSchema = z.object({
  service: z.string().min(1),
});

export const RequestSiteVisitParamsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  project_type: z.string().optional(),
  preferred_date: z.string().optional(),
});

export const CheckBookingSlotsParamsSchema = z.object({
  date_preference: z.string().optional(),
  service_type: z.string().optional(),
});

export const CreateBookingParamsSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  service_type: z.string(),
  date: z.string(),
  time_slot: z.string().optional(),
  address: z.string().optional(),
});
