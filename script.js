document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate');
    const unitsInput = document.getElementById('units');
    const resultDiv = document.getElementById('result');

    calculateButton.addEventListener('click', calculateBill);

    function calculateBill() {
        const units = Number(unitsInput.value);
        let totalCharge = 0;
        let subsidy = 0;
        let slabwiseCalculation = [];

        if (units <= 500) {
            // Calculation for units up to 500
            const slabs = [
                { from: 1, to: 100, rate: 0, units: 0, amount: 0 },
                { from: 101, to: 200, rate: 2.35, units: 0, amount: 0 },
                { from: 201, to: 400, rate: 4.7, units: 0, amount: 0 },
                { from: 401, to: 500, rate: 6.3, units: 0, amount: 0 },
            ];

            let remainingUnits = units;

            for (let slab of slabs) {
                if (remainingUnits > 0) {
                    const unitsInSlab = Math.min(remainingUnits, slab.to - slab.from + 1);
                    slab.units = unitsInSlab;
                    slab.amount = unitsInSlab * slab.rate;
                    totalCharge += slab.amount;
                    remainingUnits -= unitsInSlab;
                    slabwiseCalculation.push({ ...slab });
                } else {
                    break;
                }
            }

            // Calculate subsidy for units up to 500
            if (units <= 100) {
                subsidy = totalCharge; // Free for first 100 units
            } else if (units <= 200) {
                subsidy = 0; // No subsidy for 101-200 units
            } else if (units <= 400) {
                subsidy = 60;
            } else if (units <= 500) {
                subsidy = 280;
            }
        } else {
            // Calculation for units above 500
            const slabs = [
                { from: 1, to: 100, rate: 0, units: 100, amount: 0 },
                { from: 101, to: 400, rate: 4.7, units: 300, amount: 1410 },
                { from: 401, to: 500, rate: 6.3, units: 100, amount: 630 },
                { from: 501, to: 600, rate: 8.4, units: 0, amount: 0 },
                { from: 601, to: 800, rate: 9.45, units: 0, amount: 0 },
                { from: 801, to: 1000, rate: 10.5, units: 0, amount: 0 },
                { from: 1001, to: Infinity, rate: 11.55, units: 0, amount: 0 },
            ];

            let remainingUnits = units - 500;

            for (let i = 3; i < slabs.length; i++) {
                const slab = slabs[i];
                if (remainingUnits > 0) {
                    const unitsInSlab = Math.min(remainingUnits, slab.to - slab.from + 1);
                    slab.units = unitsInSlab;
                    slab.amount = unitsInSlab * slab.rate;
                    remainingUnits -= unitsInSlab;
                }
            }

            slabwiseCalculation = slabs;
            totalCharge = slabs.reduce((sum, slab) => sum + slab.amount, 0);

            // Calculate subsidy for units above 500
            subsidy = Math.min(515, totalCharge * 0.02);
        }

        const ccNewSubsidy = units <= 400 ? 480 : 0; // CC New Subsidy (100 units) Rs.(-)
        const netCurrentCharges = totalCharge - subsidy;
        const netAmount = netCurrentCharges - ccNewSubsidy;

        displayResult({
            totalCharge,
            subsidy,
            ccNewSubsidy,
            netCurrentCharges,
            netAmount,
            slabwiseCalculation
        });
    }

    function displayResult(result) {
        document.getElementById('totalCharge').textContent = `₹${result.totalCharge.toFixed(2)}`;
        document.getElementById('subsidy').textContent = `₹${result.subsidy.toFixed(2)}`;
        document.getElementById('ccNewSubsidy').textContent = `₹${result.ccNewSubsidy.toFixed(2)}`;
        document.getElementById('netCurrentCharges').textContent = `₹${result.netCurrentCharges.toFixed(2)}`;
        document.getElementById('netAmount').textContent = `₹${result.netAmount.toFixed(2)}`;

        const slabTableBody = document.querySelector('#slabTable tbody');
        slabTableBody.innerHTML = '';
        result.slabwiseCalculation.forEach(slab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${slab.from}</td>
                <td>${slab.to === Infinity ? '∞' : slab.to}</td>
                <td>${slab.units}</td>
                <td>₹${slab.rate.toFixed(2)}</td>
                <td>₹${slab.amount.toFixed(2)}</td>
            `;
            slabTableBody.appendChild(row);
        });

        resultDiv.classList.remove('hidden');
    }
});