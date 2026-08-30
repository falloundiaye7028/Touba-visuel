export interface PaymentProvider {
  readonly name: string;
  createPayment(input: { amount: number; currency: string; reference: string }): Promise<{ providerReference: string; status: "pending" | "confirmed" }>;
}

export interface MessagingProvider {
  sendMessage(to: string, message: string): Promise<{ id: string }>;
  sendTemplate(to: string, template: string, variables: Record<string, string>): Promise<{ id: string }>;
  sendDocument(to: string, signedUrl: string, filename: string): Promise<{ id: string }>;
}

export interface StorageProvider {
  put(input: { key: string; bytes: Uint8Array; mimeType: string }): Promise<{ key: string }>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
  remove(key: string): Promise<void>;
}

export interface BillingProvider {
  createCheckout(organizationId: string, plan: "SOLO" | "AGENCY" | "BUSINESS" | "ENTERPRISE"): Promise<{ url: string }>;
}

export class MockMessagingProvider implements MessagingProvider {
  async sendMessage() { return { id: crypto.randomUUID() }; }
  async sendTemplate() { return { id: crypto.randomUUID() }; }
  async sendDocument() { return { id: crypto.randomUUID() }; }
}
