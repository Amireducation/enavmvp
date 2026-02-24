"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, FileText, ArrowRight } from "lucide-react"

interface ServiceCardProps {
  serviceId: string
  name: string
  category: string
  description: string
  processingTime: string
  fee: number
  onApply: (serviceId: string) => void
}

export function ServiceCard({
  serviceId,
  name,
  category,
  description,
  processingTime,
  fee,
  onApply,
}: ServiceCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
            <Badge className="bg-amber-500/20 text-amber-200">{category}</Badge>
          </div>
        </div>

        <p className="text-slate-400 mb-4 flex-1">{description}</p>

        <div className="space-y-2 mb-6 py-3 border-y border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Processing: {processingTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span>Fee: ETB {fee.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={() => onApply(serviceId)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
