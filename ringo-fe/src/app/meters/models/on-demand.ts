export interface MeterQueryRequest {
  meterId: string;
  fanId: string;
  from: number;
  to: number;
}

export interface ATCommandRequest {
  fanIds: string[];
  command: string;
}
