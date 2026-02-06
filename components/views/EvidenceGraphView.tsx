
import React from 'react';
import { EvidenceNode, VerificationReport } from '../../types';
import { ReportSection } from './evidence/ReportSection';
import { TimelineSection } from './evidence/TimelineSection';

export const EvidenceGraphView: React.FC<{ evidence: EvidenceNode[], report?: VerificationReport }> = ({ evidence, report }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 max-w-7xl mx-auto pb-32">
    {report && <ReportSection report={report} />}
    <TimelineSection evidence={evidence} />
  </div>
);
