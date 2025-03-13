import { Flag } from "lucide-react"
import { theme } from "@/styles/theme"

export default function DashboardPreview() {
  return (
    <div
      className="w-full max-w-4xl mx-auto mt-8 rounded-xl p-4 sm:p-6"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(10px)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: theme.primaryLight }}></div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium">John Smith</h3>
              <Flag className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">Portfolio Manager</p>
          </div>
        </div>
        <div
          className="flex items-center space-x-2 px-4 py-1 rounded-full"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          <span className="text-gray-300 text-sm">PENDING</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "AUM", value: "$160.00M" },
          { label: "Monthly Returns", value: "$12,100.00" },
          { label: "YTD Returns", value: "$585.32" },
          { label: "Total Returns", value: "$12,653.86" },
        ].map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-gray-400 text-sm">{item.label}</p>
            <p className="text-white font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
