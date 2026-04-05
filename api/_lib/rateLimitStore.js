const buckets = new Map();
const dailyUsage = new Map();

function takeToken(key, windowMs, maxRequests) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    buckets.set(key, next);
    return { allowed: true, remaining: maxRequests - 1, resetAt: next.resetAt };
  }
  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  return { allowed: true, remaining: maxRequests - current.count, resetAt: current.resetAt };
}

function takeDailyUsage(key, dailyLimit) {
  const day = new Date().toISOString().slice(0, 10);
  const composite = `${key}:${day}`;
  const count = dailyUsage.get(composite) || 0;
  if (count >= dailyLimit) {
    return { allowed: false, remaining: 0 };
  }
  dailyUsage.set(composite, count + 1);
  return { allowed: true, remaining: dailyLimit - (count + 1) };
}

module.exports = { takeToken, takeDailyUsage };
