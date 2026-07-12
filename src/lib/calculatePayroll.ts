export interface PayrollBreakdown {
  gross: number;
  nssf: number;
  shif: number;
  ahl: number;
  taxablePay: number;
  payeBeforeRelief: number;
  personalRelief: number;
  paye: number;
  net: number;
}

export function calculatePayroll(gross: number): PayrollBreakdown {
  // NSSF (Tier I + Tier II, effective Feb 2026)
  // Tier I: 6% of the first KES 9,000 (max 540)
  // Tier II: 6% of gross between 9,000 and 108,000 (max 5,940)
  const tier1 = Math.min(gross, 9000) * 0.06;
  const tier2 = Math.max(0, Math.min(gross, 108000) - 9000) * 0.06;
  const nssf = tier1 + tier2; // max KES 6,480

  // SHIF: 2.75% of gross, minimum 300
  const shifRaw = gross * 0.0275;
  const shif = Math.max(300, shifRaw);

  // AHL: 1.5% of gross
  const ahl = gross * 0.015;

  // Taxable Pay
  const taxablePay = Math.max(0, gross - nssf - shif);

  // PAYE
  let payeBeforeRelief = 0;
  
  if (taxablePay > 0) {
    const band1 = Math.min(taxablePay, 24000);
    payeBeforeRelief += band1 * 0.10;

    if (taxablePay > 24000) {
      const band2 = Math.min(taxablePay - 24000, 8333);
      payeBeforeRelief += band2 * 0.25;

      if (taxablePay > 32333) {
        const band3 = Math.min(taxablePay - 32333, 467667); // 500000 - 32333
        payeBeforeRelief += band3 * 0.30;

        if (taxablePay > 500000) {
          const band4 = Math.min(taxablePay - 500000, 300000); // 800000 - 500000
          payeBeforeRelief += band4 * 0.325;

          if (taxablePay > 800000) {
            const band5 = taxablePay - 800000;
            payeBeforeRelief += band5 * 0.35;
          }
        }
      }
    }
  }

  const personalRelief = 2400;
  const paye = Math.max(0, payeBeforeRelief - personalRelief);

  const net = gross - nssf - shif - ahl - paye;

  return {
    gross,
    nssf,
    shif,
    ahl,
    taxablePay,
    payeBeforeRelief,
    personalRelief,
    paye,
    net,
  };
}
