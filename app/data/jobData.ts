import { INDUSTRY_DB } from "./industryData";

export const JOB_DETAILS: Record<string, { description: string; salary: string; future?: string; relocation?: string }> = {};
export const JOB_LIST: Record<string, string[]> = {};
export const FLAT_JOB_LIST: string[] = []; // ★追加：すべての職種をフラットに並べた配列

// INDUSTRY_DB を走査してデータを自動抽出
Object.entries(INDUSTRY_DB).forEach(([industryName, industryObj]: [string, any]) => {
  JOB_LIST[industryName] = [];
  
  // ※もし INDUSTRY_DB の構造が categories や jobs などの場合は適宜合わせてください
  const jobsObj = industryObj.specializedJobs || industryObj.jobs || {};

  Object.entries(jobsObj).forEach(([jobName, jobInfo]: [string, any]) => {
    JOB_LIST[industryName].push(jobName);
    FLAT_JOB_LIST.push(jobName); // フラット配列にも追加

    JOB_DETAILS[jobName] = {
      description: jobInfo.description || "",
      salary: jobInfo.salary || "",
      future: jobInfo.future || "",
      relocation: jobInfo.relocation || "",
    };
  });
});