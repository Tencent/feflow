declare interface ReportBody {
  command: string;
  last_command: string;
  feflow_version: string;
  command_source: string;
  user_name: string;
  params: string;
  err_message: string;
  system_info: string;
  project: string;
  status: string;
}

declare interface RecallBody {
  command: string;
  generator_project: string;
  recall_id: string;
  cost_time: string;
  err_message: string;
  is_fail: string;
  status: string;
}
