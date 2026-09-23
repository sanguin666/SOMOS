import { apiDelete, apiGet, apiPatch, apiPost, apiPostForm } from './client';
import type { ServiceRequestDetail, ServiceRequestStatus, ServiceRequestSummary } from './types';

export type RequestFilter = 'open' | 'closed' | 'all';

export function getRequests(poiId: string, filter: RequestFilter): Promise<ServiceRequestSummary[]> {
  return apiGet<ServiceRequestSummary[]>(`/pois/${poiId}/requests?filter=${filter}`);
}

// Opening a request marks it read for the office.
export function getRequest(poiId: string, id: string): Promise<ServiceRequestDetail> {
  return apiGet<ServiceRequestDetail>(`/pois/${poiId}/requests/${id}`);
}

// Setting appointmentAt without a status also moves the request to
// "appointment set"; null takes the appointment off again.
export function updateRequest(
  poiId: string,
  id: string,
  body: { status?: ServiceRequestStatus; appointmentAt?: string | null; appointmentPlace?: string | null },
): Promise<ServiceRequestDetail> {
  return apiPatch<ServiceRequestDetail>(`/pois/${poiId}/requests/${id}`, body);
}

export function sendRequestMessage(
  poiId: string,
  id: string,
  body: string,
  file: File | null,
): Promise<ServiceRequestDetail> {
  const formData = new FormData();
  if (body) formData.append('body', body);
  if (file) formData.append('file', file);
  return apiPostForm<ServiceRequestDetail>(`/pois/${poiId}/requests/${id}/messages`, formData);
}

// Asks the member for a paper, which then shows in their checklist.
export function askForDocument(
  poiId: string,
  id: string,
  body: { label: string; note?: string },
): Promise<ServiceRequestDetail> {
  return apiPost<ServiceRequestDetail>(`/pois/${poiId}/requests/${id}/documents`, body);
}

export function setDocumentReceived(
  poiId: string,
  id: string,
  documentId: string,
  received: boolean,
): Promise<ServiceRequestDetail> {
  return apiPatch<ServiceRequestDetail>(`/pois/${poiId}/requests/${id}/documents/${documentId}`, { received });
}

export function removeDocument(poiId: string, id: string, documentId: string): Promise<ServiceRequestDetail> {
  return apiDelete<ServiceRequestDetail>(`/pois/${poiId}/requests/${id}/documents/${documentId}`);
}
