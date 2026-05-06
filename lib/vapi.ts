export async function triggerVapiCall(submissionId: string, phone: string, name: string) {
  const apiKey = process.env.VAPI_API_KEY
  const assistantId = process.env.VAPI_ASSISTANT_ID
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID

  if (!apiKey || !assistantId || !phoneNumberId) return

  const res = await fetch('https://api.vapi.ai/call/phone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      phoneNumberId,
      assistantId,
      customer: { number: phone, name },
      assistantOverrides: {
        variableValues: { submissionId, customerName: name },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`VAPI call failed: ${err}`)
  }

  return res.json()
}
