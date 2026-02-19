This is a comprehensive Master Plan. It merges the immediate fixes from your document with the advanced multi-brand AI ecosystem you require.

---

# **The "United Trades" Ecosystem: Master Technical Plan**

## **1. Architecture Overview**

To connect **The Prime Electrical**, **AKF Construction**, and **CleanJet** without merging them into one messy website, we will use a **Hub-and-Spoke Architecture**.

*   **The Spokes (The Websites):** Three separate, high-performance websites built on the **Tailwind Salient** template. They operate independently to maximize SEO for their specific niches.
*   **The Hub (The AI & Database):** A central automation layer (Make.com) and a "Staging Database" (Airtable or Supabase) that ingests data from all three sites before pushing it to your final Job Management Software (e.g., Simpro/Fergus).

---

## **2. The Central "AI Brain" (The Interconnection)**

This is the core requirement: *How the sites talk to each other.*

We will train a single instance of **GPT-4o (OpenAI)** with a "Master System Prompt" that understands the capabilities of all three companies.

### **The "Cross-Pollination" Logic Engine**
Every time a lead comes in (Voice or Web) from *any* of the three sites, the AI performs a **Dependency Check**.

**The Logic Script:**
1.  **Analyze Request:** "Client wants [Task A]."
2.  **Check Internal Synergies:** "Does [Task A] usually create a mess? (Yes = CleanJet opportunity). Does [Task A] require wall/ceiling access? (Yes = AKF opportunity)."
3.  **Action:**
    *   If Synergy found -> Generate specialized quote/email offering the bundle.
    *   If No Synergy -> Process as standard single-service lead.

---

## **3. Detailed Feature Breakdown**

### **Feature A: The AI Voice Receptionist (Phone)**
*Deployment: 3 separate phone numbers forwarding to 1 AI Brain (or 3 distinct AI personas).*

**Capabilities:**
1.  **Context Switching:**
    *   *Scenario:* Customer calls Prime Electrical. "I need my kitchen lights moved, but I haven't built the new ceiling yet."
    *   *AI Response:* "Not a problem. We can schedule the electrical rough-in. Since you mentioned the ceiling isn't built, do you already have a builder, or would you like our construction partner, AKF, to quote the ceiling installation while we are there?"
2.  **Triage Mode (From your Doc):**
    *   Detects "Emergency" keywords (Sparking, Fire, Power Outage).
    *   If Emergency: Bypasses the database and triggers an SMS/Call to the on-call electrician immediately.
    *   If Standard: Logs into the database for a callback.
3.  **Tech Stack:** Vapi.ai (Voice Engine) + Twilio (Telephony).

### **Feature B: The Smart Email & Form Parser**
*Deployment: Connected to "Contact Us" forms on all 3 sites.*

**The Workflow:**
1.  **Ingestion:** Customer fills out a form on **The Prime Electrical**.
2.  **Extraction:** AI reads the text.
    *   *Name:* John Doe
    *   *Issue:* "Need a heat pump installed in the living room."
3.  **The "Upsell" Check:**
    *   AI Analysis: "Heat pump installation creates dust and requires drilling."
    *   *Trigger:* AI flags **CleanJet** opportunity.
4.  **Automated Reply:**
    *   "Hi John, thanks for the heat pump enquiry... [Standard Quote Info]. P.S. We own a specialist cleaning division, CleanJet. Would you like us to add a 'Post-Install Dust Down' to your quote for just $99?"
5.  **Database Sync:** The lead is entered into the Central Database tagged as *Electrical (Hot)* and *Cleaning (Warm)*.

### **Feature C: The "Staging" Database**
*The glue holding the 3 sites together.*

Before sending data to Simpro/Fergus (which can be rigid), we send leads to a **Staging Database (Airtable/Supabase)**.
*   **Why?** This allows the AI to "enrich" the data. It can link a Prime Electrical Client to an AKF Construction profile automatically.
*   **Result:** You get a single view of the customer ("The Golden Record"). You can see they used Prime in 2024, CleanJet in 2025, and are asking about AKF in 2026.

---

## **4. Website Design & Optimization (Tailwind Salient)**

We will apply the **Tailwind Salient** template to all three sites for speed and visual consistency, using **Tailwind UI Blocks** for specific components.

### **Site 1: The Prime Electrical (Redesign)**
*   **Fixes (From Doc):**
    *   Hardcode "10+ Years Experience" in the stats counter.
    *   Fix Typos ("Competent", "Recommend").
    *   Formatting: Auto-format prices to `$1,200.00`.
*   **New UI Features:**
    *   **Sticky Mobile Footer:** "Call Now" (Left) and "Book Online" (Right).
    *   **Financing Block:** Top-of-page banner for Q Mastercard/GEM Visa (High ticket conversion).
    *   **The "Hub" Footer:** "Part of the Prime Group: [Logo AKF] [Logo CleanJet]" (Cross-linking for SEO).

### **Site 2: AKF Construction (Redesign)**
*   **Focus:** Trust & Portfolio.
*   **UI Features:**
    *   **Before/After Sliders:** Interactive UI block to show renovation quality.
    *   **Timeline Visualizer:** A graphic showing "Consultation -> Build -> Clean (via CleanJet) -> Handover."

### **Site 3: CleanJet (New Build)**
*   **Focus:** Speed & Simplicity.
*   **UI Features:**
    *   **Instant Booking:** "Select Rooms -> Select Date -> Pay."
    *   **Subscription Toggle:** "One-off Clean" vs "Weekly (Save 20%)."

---

## **5. Strategic Implementation Roadmap**

### **Phase 1: The "Prime" Rescue (Weeks 1-2)**
*   **Objective:** Stop the bleeding on the main site.
*   **Actions:**
    *   Code fixes on Prime Electrical (Counters, Typos, Pricing).
    *   Install the **Mobile Sticky Button**.
    *   Set up basic **Missed Call Text Back** (SMS Automation) so no lead is lost while we build the big system.

### **Phase 2: The "Brain" & New Sites (Weeks 3-6)**
*   **Objective:** Build the engine and the new shells.
*   **Actions:**
    *   Set up the **Central Staging Database**.
    *   Develop **AKF Construction** and **CleanJet** on the Salient framework.
    *   Redesign **Prime Electrical** onto the Salient framework (migration).
    *   Train the **AI Master Prompt** on the services of all 3 companies.

### **Phase 3: The Connections (Weeks 7-9)**
*   **Objective:** Turn on the cross-pollination.
*   **Actions:**
    *   Connect Website Forms to the AI Agent.
    *   Activate the **Cross-Sell Logic** (The "Electrical -> Construction" suggestion engine).
    *   Deploy the **Voice AI** for after-hours handling.

### **Phase 4: Database Integration (Week 10)**
*   **Objective:** Sync with your Job Management Software.
*   **Actions:**
    *   Connect the Staging Database to Simpro/Fergus/Tradify via Webhooks.
    *   Ensure that when a job is "Won," it pushes to the accounting software.

---

## **6. Summary of Technologies**

| Component | Technology Selected | Function |
| :--- | :--- | :--- |
| **Frontend** | **Next.js + Tailwind CSS** | The framework for the 3 websites. |
| **Design System** | **Salient Template + UI Blocks** | Professional, high-converting aesthetic. |
| **The "Brain"** | **OpenAI GPT-4o (via API)** | Analyzes text/voice and finds cross-selling opportunities. |
| **Automation** | **Make.com** | The traffic controller connecting the sites to the DB. |
| **Voice AI** | **Vapi.ai** | The phone receptionist that sounds Kiwi. |
| **Database** | **Airtable / Supabase** | The central hub where all 3 sites dump their data. |
| **Job Mgmt** | **Your Current Tool (e.g., Simpro)** | The final destination for confirmed jobs. |