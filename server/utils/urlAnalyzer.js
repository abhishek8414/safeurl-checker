import validator from 'validator';

const suspiciousKeywords = [
  'login', 'signin', 'verify', 'account', 'update', 'bank', 'billing',
  'confirm', 'secure', 'payment', 'wallet', 'invoice', 'password',
  'urgent', 'free', 'winner', 'claim', 'click', 'alert', 'limited',
  'winner', 'prize', 'offer', 'cash', 'suspended', 'activate'
];

const suspiciousTlds = ['tk', 'club', 'xyz', 'top', 'loan', 'bid', 'ga', 'cf', 'ml'];

const normalizeUrl = (rawUrl) => {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';

  let url = trimmed;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const normalized = new URL(url);
    return normalized.toString();
  } catch (error) {
    return url;
  }
};

const analyzeUrl = (rawUrl) => {
  const input = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  const normalizedUrl = normalizeUrl(input);
  const checks = [];
  const warnings = [];
  const positiveIndicators = [];

  let score = 100;
  let riskLevel = 'Likely Safe';

  if (!input) {
    return {
      normalizedUrl: '',
      domain: '',
      protocol: '',
      score: 0,
      riskLevel: 'High Risk',
      checks: ['No URL was provided'],
      warnings: ['Enter a valid URL to analyze it.'],
      positiveIndicators: [],
      isValid: false,
    };
  }

  let parsedUrl = null;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch (error) {
    warnings.push('URL format appears invalid or malformed.');
    score -= 45;
    return {
      normalizedUrl,
      domain: '',
      protocol: '',
      score: Math.max(0, score),
      riskLevel: 'High Risk',
      checks: ['URL validation failed'],
      warnings,
      positiveIndicators,
      isValid: false,
    };
  }

  const protocol = parsedUrl.protocol.replace(':', '').toUpperCase();
  const hostname = parsedUrl.hostname.toLowerCase();
  const domain = hostname.replace(/^www\./i, '');
  const pathname = parsedUrl.pathname || '/';

  if (protocol === 'HTTPS') {
    checks.push('HTTPS enabled');
    positiveIndicators.push('Encrypted connection available');
  } else {
    warnings.push('The URL uses HTTP instead of HTTPS.');
    score -= 30;
  }

  if (validator.isURL(normalizedUrl, { require_protocol: true, require_tld: true })) {
    checks.push('Valid domain format');
    positiveIndicators.push('Domain format appears valid');
  } else {
    warnings.push('Domain format is weak or invalid.');
    score -= 25;
  }

  const urlLength = normalizedUrl.length;
  if (urlLength > 200) {
    warnings.push('URL length is unusually long for a normal website.');
    score -= 15;
  } else {
    positiveIndicators.push('URL length is within a normal range');
  }

  const subdomainCount = hostname.split('.').length - 2;
  if (subdomainCount > 2) {
    warnings.push('Excessive subdomain nesting was detected.');
    score -= 12;
  } else {
    positiveIndicators.push('Subdomain structure looks normal');
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    warnings.push('The hostname is an IP address rather than a domain name.');
    score -= 20;
  } else {
    positiveIndicators.push('Host is not an IP address');
  }

  if (/[<>"'`]/.test(hostname) || /[<>"'`]/.test(pathname)) {
    warnings.push('Suspicious characters found in the URL.');
    score -= 18;
  }

  if (/%[0-9A-Fa-f]{2}/.test(normalizedUrl)) {
    warnings.push('URL contains encoded characters that may be used to obfuscate content.');
    score -= 10;
  } else {
    positiveIndicators.push('No obvious URL encoding obfuscation detected');
  }

  if (hostname.includes('@')) {
    warnings.push('The URL includes an @ symbol, which can be used to hide the real domain.');
    score -= 18;
  }

  const hyphenMatches = (hostname.match(/-/g) || []).length;
  if (hyphenMatches > 3) {
    warnings.push('The domain contains an unusually high number of hyphenated segments.');
    score -= 10;
  }

  const lowerHost = hostname.toLowerCase();
  const keywordHits = suspiciousKeywords.filter((keyword) => lowerHost.includes(keyword) || pathname.toLowerCase().includes(keyword));
  if (keywordHits.length > 0) {
    warnings.push(`Suspicious keywords detected: ${keywordHits.slice(0, 3).join(', ')}`);
    score -= 15 + keywordHits.length * 5;
  } else {
    positiveIndicators.push('No suspicious keywords detected');
  }

  const tld = domain.split('.').pop();
  if (suspiciousTlds.includes(tld)) {
    warnings.push('The domain uses a suspicious top-level domain.');
    score -= 12;
  }

  if (/xn--/.test(hostname) || /[\u0080-\uFFFF]/.test(domain)) {
    warnings.push('Punycode or internationalized domain characters were detected.');
    score -= 8;
  } else {
    positiveIndicators.push('No punycode or IDN obfuscation detected');
  }

  const knownPhishingPatterns = ['login', 'verify', 'secure', 'account', 'update', 'confirm'];
  const phishingPatternMatch = knownPhishingPatterns.some((pattern) => lowerHost.includes(pattern) || pathname.toLowerCase().includes(pattern));
  if (phishingPatternMatch) {
    warnings.push('The URL contains phrases commonly associated with phishing pages.');
    score -= 10;
  }

  const hasRedirectIndicators = /redirect|out=|next=|target=|return=/i.test(pathname) || /redirect|out=|next=|target=|return=/i.test(parsedUrl.search || '');
  if (hasRedirectIndicators) {
    warnings.push('Redirect-like parameters were detected, which may be used for phishing flows.');
    score -= 12;
  }

  const deceptivePathPattern = /(?:malware|phish|scam|steal|free-money|claim-prize|bank|payment|login|account)/i;
  if (deceptivePathPattern.test(pathname)) {
    warnings.push('The URL path resembles a deceptive or credential-harvesting pattern.');
    score -= 8;
  }

  if (score >= 80) {
    riskLevel = 'Likely Safe';
  } else if (score >= 50) {
    riskLevel = 'Suspicious';
  } else {
    riskLevel = 'High Risk';
  }

  if (warnings.length === 0) {
    warnings.push('Domain reputation could not be verified.');
  }

  return {
    normalizedUrl: normalizedUrl,
    domain,
    protocol,
    score: Math.max(0, Math.min(100, score)),
    riskLevel,
    checks: checks.length ? checks : ['Basic URL structure inspected'],
    warnings,
    positiveIndicators,
    isValid: true,
  };
};

export { normalizeUrl, analyzeUrl };
