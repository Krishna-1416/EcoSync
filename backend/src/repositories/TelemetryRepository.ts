export interface GateStatus {
  gateId: string;
  capacityPercent: number;
  status: 'Open' | 'Closed' | 'Restricted';
}

export interface TransitStatus {
  line: string;
  delayMinutes: number;
  status: 'Normal' | 'Delayed' | 'Suspended';
}

export interface TelemetryData {
  gates: GateStatus[];
  transit: TransitStatus[];
}

export class TelemetryRepository {
  private static instance: TelemetryRepository;
  
  private telemetry: TelemetryData = {
    gates: [
      { gateId: 'Gate A', capacityPercent: 40, status: 'Open' },
      { gateId: 'Gate B', capacityPercent: 85, status: 'Restricted' },
      { gateId: 'Gate C', capacityPercent: 20, status: 'Open' }
    ],
    transit: [
      { line: 'Metro Blue Line', delayMinutes: 0, status: 'Normal' },
      { line: 'Stadium Shuttle', delayMinutes: 15, status: 'Delayed' }
    ]
  };

  private constructor() {}

  public static getInstance(): TelemetryRepository {
    if (!TelemetryRepository.instance) {
      TelemetryRepository.instance = new TelemetryRepository();
    }
    return TelemetryRepository.instance;
  }

  public getTelemetry(): TelemetryData {
    return this.telemetry;
  }

  public updateTelemetry(newData: Partial<TelemetryData>): void {
    if (newData.gates) this.telemetry.gates = newData.gates;
    if (newData.transit) this.telemetry.transit = newData.transit;
  }
}
