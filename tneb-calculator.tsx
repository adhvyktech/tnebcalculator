import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ZapIcon } from 'lucide-react'

export default function TNEBCalculator() {
  const [units, setUnits] = useState<number>(0)
  const [result, setResult] = useState<any>(null)

  const calculateBill = () => {
    let totalCharge = 0
    let subsidy = 0
    let slabwiseCalculation = []

    if (units <= 500) {
      // Calculation for units up to 500
      const slabs = [
        { from: 1, to: 100, rate: 0, units: 0, amount: 0 },
        { from: 101, to: 200, rate: 2.35, units: 0, amount: 0 },
        { from: 201, to: 400, rate: 4.7, units: 0, amount: 0 },
        { from: 401, to: 500, rate: 6.3, units: 0, amount: 0 },
      ]

      let remainingUnits = units

      for (let slab of slabs) {
        if (remainingUnits > 0) {
          const unitsInSlab = Math.min(remainingUnits, slab.to - slab.from + 1)
          slab.units = unitsInSlab
          slab.amount = unitsInSlab * slab.rate
          totalCharge += slab.amount
          remainingUnits -= unitsInSlab
          slabwiseCalculation.push({ ...slab })
        } else {
          break
        }
      }

      // Calculate subsidy for units up to 500
      if (units <= 100) {
        subsidy = totalCharge // Free for first 100 units
      } else if (units <= 200) {
        subsidy = 0 // No subsidy for 101-200 units
      } else if (units <= 400) {
        subsidy = 60
      } else if (units <= 500) {
        subsidy = 280
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
      ]

      let remainingUnits = units - 500

      for (let i = 3; i < slabs.length; i++) {
        const slab = slabs[i]
        if (remainingUnits > 0) {
          const unitsInSlab = Math.min(remainingUnits, slab.to - slab.from + 1)
          slab.units = unitsInSlab
          slab.amount = unitsInSlab * slab.rate
          remainingUnits -= unitsInSlab
        }
      }

      slabwiseCalculation = slabs
      totalCharge = slabs.reduce((sum, slab) => sum + slab.amount, 0)

      // Calculate subsidy for units above 500
      subsidy = Math.min(515, totalCharge * 0.02)
    }

    const ccNewSubsidy = units <= 400 ? 480 : 0 // CC New Subsidy (100 units) Rs.(-)
    const netCurrentCharges = totalCharge - subsidy
    const netAmount = netCurrentCharges - ccNewSubsidy

    setResult({
      totalCharge,
      subsidy,
      ccNewSubsidy,
      netCurrentCharges,
      netAmount,
      slabwiseCalculation
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600 flex items-center justify-center">
            <ZapIcon className="mr-2" />
            TNEB Bill Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Input
              type="number"
              placeholder="Enter consumed units"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="text-lg"
            />
            <Button onClick={calculateBill} className="bg-blue-500 hover:bg-blue-600 text-white">
              Calculate
            </Button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Charge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">₹{result.totalCharge.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CC Subsidy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">₹{result.subsidy.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CC New Subsidy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">₹{result.ccNewSubsidy.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Net Current Charges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">₹{result.netCurrentCharges.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Net Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">₹{result.netAmount.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Slabwise Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From Unit</TableHead>
                        <TableHead>To Unit</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.slabwiseCalculation.map((slab, index) => (
                        <TableRow key={index}>
                          <TableCell>{slab.from}</TableCell>
                          <TableCell>{slab.to === Infinity ? '∞' : slab.to}</TableCell>
                          <TableCell>{slab.units}</TableCell>
                          <TableCell>₹{slab.rate.toFixed(2)}</TableCell>
                          <TableCell>₹{slab.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}