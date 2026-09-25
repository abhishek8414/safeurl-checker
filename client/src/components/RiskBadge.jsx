const RiskBadge = ({ riskLevel }) => {
  const normalized = String(riskLevel || 'Likely Safe').toLowerCase();

  let className = 'risk-badge ok';
  if (normalized.includes('suspicious')) className = 'risk-badge warn';
  if (normalized.includes('high')) className = 'risk-badge danger';

  return <span className={className}>{riskLevel}</span>;
};

export default RiskBadge;
