import { motion } from "framer-motion";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
}

const mockInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "Sarah Johnson",
    position: "Senior Developer",
    date: "Today",
    time: "2:00 PM",
    type: "video",
    status: "scheduled"
  },
  {
    id: "2",
    candidateName: "Michael Chen",
    position: "Product Manager",
    date: "Tomorrow",
    time: "10:30 AM",
    type: "in-person",
    status: "scheduled"
  },
  {
    id: "3",
    candidateName: "Emily Davis",
    position: "UX Designer",
    date: "Dec 15",
    time: "3:00 PM",
    type: "video",
    status: "scheduled"
  }
];

export function InterviewScheduleWidget() {
  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          Upcoming Interviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockInterviews.map((interview, index) => (
          <motion.div
            key={interview.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-sm">{interview.candidateName}</h4>
                <p className="text-xs text-muted-foreground">{interview.position}</p>
              </div>
              <Badge variant={interview.type === "video" ? "secondary" : "outline"} className="text-xs">
                {interview.type === "video" ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                {interview.type}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {interview.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {interview.time}
              </span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
} 