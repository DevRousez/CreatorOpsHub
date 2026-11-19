const test = require('node:test');
const assert = require('node:assert/strict');

// Funciones puras a testear
function filterActiveAccounts(accounts) {
  return accounts.filter((a) => a.enabled !== false);
}

function generateDynamicHistory(accounts, todayDate = new Date('2026-11-18T12:00:00')) {
  const activeAccounts = filterActiveAccounts(accounts);
  const points = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const dateLabel = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

    const point = {
      date: dateLabel,
      fullDate: d.toISOString().split('T')[0],
      timestamp: d.getTime(),
    };

    for (const acc of activeAccounts) {
      const baseDailyViews = Math.max(15, acc.views24h || 100);
      const factor = 0.75 + (((i * 9 + acc.name.length * 3) % 45) / 100);
      const dayViews = Math.round(baseDailyViews * factor);

      const baseDailySubs = Math.max(1, acc.subscribersChange24h || 2);
      const daySubs = Math.max(0, Math.round(baseDailySubs * (0.8 + ((i * 5) % 40) / 100)));

      point[`views_${acc.id}`] = dayViews;
      point[`subs_${acc.id}`] = daySubs;
    }

    points.push(point);
  }
  return points;
}

function calculateOverview(accounts) {
  const activeAccounts = filterActiveAccounts(accounts);
  const totalAudience = activeAccounts.reduce((sum, a) => sum + (a.subscribers || 0), 0);
  const audienceGrowth24h = activeAccounts.reduce((sum, a) => sum + (a.subscribersChange24h || 0), 0);
  const totalViews24h = activeAccounts.reduce((sum, a) => sum + (a.views24h || 0), 0);
  const avgEngagement = activeAccounts.length > 0
    ? Number((activeAccounts.reduce((sum, a) => sum + (a.avgEngagementRate || 0), 0) / activeAccounts.length).toFixed(1))
    : 0;

  return {
    totalAudience,
    audienceGrowth24h,
    totalViews24h,
    avgEngagement,
  };
}

test('generateDynamicHistory debe generar exactamente 14 puntos diarios', () => {
  const accounts = [
    { id: 'yt-1', name: 'MundoAniToonIa', views24h: 300, subscribersChange24h: 3, enabled: true },
    { id: 'tt-1', name: 'PequeMundoToon', views24h: 120, subscribersChange24h: 2, enabled: true },
  ];

  const history = generateDynamicHistory(accounts);
  assert.equal(history.length, 14, 'El historial debe contener 14 días');
});

test('generateDynamicHistory debe asignar las claves dinámicas con el ID real de cada cuenta', () => {
  const accounts = [
    { id: 'custom-channel-99', name: 'Canal Misterio', views24h: 500, subscribersChange24h: 10, enabled: true },
  ];

  const history = generateDynamicHistory(accounts);
  const sample = history[0];

  assert.ok(typeof sample['views_custom-channel-99'] === 'number', 'Debe existir la propiedad views_${id}');
  assert.ok(typeof sample['subs_custom-channel-99'] === 'number', 'Debe existir la propiedad subs_${id}');
  assert.ok(sample['views_custom-channel-99'] > 0, 'Las vistas deben ser mayores a 0');
});

test('filterActiveAccounts solo retorna cuentas donde enabled !== false', () => {
  const accounts = [
    { id: '1', name: 'Canal A', enabled: true },
    { id: '2', name: 'Canal B', enabled: false }, // Pausada
    { id: '3', name: 'Canal C' }, // Por defecto activa
  ];

  const active = filterActiveAccounts(accounts);
  assert.equal(active.length, 2, 'Deben quedar exactamente 2 cuentas activas');
  assert.equal(active[0].id, '1');
  assert.equal(active[1].id, '3');
});

test('calculateOverview ignora cuentas desactivadas y computa solo las activas', () => {
  const accounts = [
    { id: '1', subscribers: 1000, subscribersChange24h: 50, views24h: 500, avgEngagementRate: 8.0, enabled: true },
    { id: '2', subscribers: 5000, subscribersChange24h: 200, views24h: 3000, avgEngagementRate: 12.0, enabled: false }, // Desactivada
  ];

  const overview = calculateOverview(accounts);
  assert.equal(overview.totalAudience, 1000, 'Solo debe sumar la cuenta activa');
  assert.equal(overview.audienceGrowth24h, 50);
  assert.equal(overview.totalViews24h, 500);
  assert.equal(overview.avgEngagement, 8.0);
});

test('generateDynamicHistory no genera series para cuentas desactivadas', () => {
  const accounts = [
    { id: 'activa', name: 'Canal Activo', views24h: 100, enabled: true },
    { id: 'pausada', name: 'Canal Pausado', views24h: 100, enabled: false },
  ];

  const history = generateDynamicHistory(accounts);
  const sample = history[0];

  assert.ok(sample['views_activa'] !== undefined, 'La serie de la cuenta activa debe existir');
  assert.equal(sample['views_pausada'], undefined, 'La serie de la cuenta pausada no debe existir');
});

test('calculateOverview no lanza error con lista vacía de cuentas', () => {
  const overview = calculateOverview([]);
  assert.equal(overview.totalAudience, 0);
  assert.equal(overview.avgEngagement, 0);
});
