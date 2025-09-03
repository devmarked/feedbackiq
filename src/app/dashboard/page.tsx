import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                  Coming Soon
                </h2>
                <p className="text-gray-500">
                  Dashboard overview and insights will be available here soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
