#!/usr/bin/env python3
"""
Interactive text-chat test for the 3 Prime Group Vapi assistants.
No phone number or account upgrade needed — uses Vapi's Chat API.

Usage:
  python3 vapi-test.py          # pick assistant interactively
  python3 vapi-test.py max      # Max  — Prime Electrical
  python3 vapi-test.py alex     # Alex — AKF Construction
  python3 vapi-test.py jess     # Jess — CleanJet
"""

import sys, json, subprocess

API_KEY = "7f6fff5d-df27-42f5-8503-63d3d3f84330"
BASE    = "https://api.vapi.ai"

ASSISTANTS = {
    "max":  ("4ab9a8b3-d2b1-4127-b1a5-c1d4fa05e76d",  "Max  -- Prime Electrical"),
    "alex": ("756c46ed-2c04-49f6-a5fc-c820d11a92dd",  "Alex -- AKF Construction"),
    "jess": ("35ce9713-8297-491e-98ba-6c809a154c2c",  "Jess -- CleanJet"),
}

def curl_post(url, payload):
    body = json.dumps(payload)
    result = subprocess.run(
        ["curl", "-s", "-X", "POST", url,
         "-H", "Authorization: Bearer " + API_KEY,
         "-H", "Content-Type: application/json",
         "-d", body],
        capture_output=True, text=True, encoding="utf-8"
    )
    return json.loads(result.stdout)

def chat(assistant_id, conversation, user_msg):
    conversation.append({"role": "user", "content": user_msg})
    payload = {"assistantId": assistant_id, "input": conversation}
    result  = curl_post(BASE + "/chat", payload)

    reply_text  = ""
    tool_called = None
    for msg in result.get("output", []):
        if msg.get("role") == "assistant":
            if msg.get("content"):
                reply_text = msg["content"]
            if msg.get("tool_calls"):
                for tc in msg["tool_calls"]:
                    fn   = tc.get("function", {})
                    args = {}
                    try:
                        args = json.loads(fn.get("arguments", "{}"))
                    except Exception:
                        pass
                    tool_called = (fn.get("name"), args)

    conversation.append({"role": "assistant", "content": reply_text})
    return reply_text, tool_called, result.get("cost", 0)

def pick_assistant():
    print("\nPick an assistant:")
    for key, (_, label) in ASSISTANTS.items():
        print(f"  [{key}]  {label}")
    choice = input("\nEnter max / alex / jess: ").strip().lower()
    return choice if choice in ASSISTANTS else "max"

def main():
    key = sys.argv[1].lower() if len(sys.argv) > 1 else pick_assistant()
    if key not in ASSISTANTS:
        print(f"Unknown: '{key}'. Use: max | alex | jess")
        sys.exit(1)

    assistant_id, label = ASSISTANTS[key]
    sep = "=" * 60
    print(f"\n{sep}\n  Chatting with {label}\n  Type 'quit' or Ctrl+C to exit\n{sep}\n")

    conversation = []
    total_cost   = 0.0

    reply, tool, cost = chat(assistant_id, conversation, "Hello")
    total_cost += cost
    print(f"[{label}]: {reply}")
    if tool:
        print(f"  ** TOOL CALLED: {tool[0]}({json.dumps(tool[1])})")
    print()

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit", "q"):
            break

        reply, tool, cost = chat(assistant_id, conversation, user_input)
        total_cost += cost
        print(f"\n[{label}]: {reply}")
        if tool:
            print(f"  ** TOOL CALLED: {tool[0]}({json.dumps(tool[1])})")
        print()

    print(f"\n{sep}\n  Session cost: ${total_cost:.4f} USD\n{sep}\n")

if __name__ == "__main__":
    main()
