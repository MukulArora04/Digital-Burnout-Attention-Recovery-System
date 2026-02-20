import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BreakAnalysis {
    walkBreaks: bigint;
    restorativeRatio: number;
    deskRecoveries: bigint;
    totalBreaks: bigint;
}
export interface TimerSetting {
    duration: bigint;
    notification: boolean;
}
export type Time = bigint;
export interface Report {
    patterns: Array<Pattern>;
    timestamp: Time;
}
export interface Achievement {
    streakStart: Time;
    isDeepWork: boolean;
    streakType: StreakType;
    streakEnd: Time;
    milestone: bigint;
}
export interface Session {
    duration: bigint;
    sessionType: SessionType;
    appName: string;
    timestamp: Time;
    category: AppCategory;
}
export type Pattern = {
    __kind__: "negative";
    negative: NegativePattern;
} | {
    __kind__: "positive";
    positive: PositivePattern;
};
export interface ContextSwitch {
    sourceApp: string;
    targetApp: string;
    timestamp: Time;
}
export interface BreakSession {
    startTime: Time;
    timerSetting: TimerSetting;
    endTime: Time;
    breakType: BreakType;
    isRestorative: boolean;
}
export interface FocusScore {
    distractionScore: bigint;
    timestamp: Time;
    timeAway: bigint;
    tabSwitchCount: bigint;
}
export interface BurnoutCalculation {
    currentIndex: bigint;
    focusSessionTimestamps: Array<Time>;
    switchCount: bigint;
    breakAnalysis: BreakAnalysis;
    timestamp: Time;
    sleepAnalysis: SleepAnalysis;
    notificationAnalysis: NotificationAnalysis;
    previousIndex: bigint;
}
export interface SleepAnalysis {
    sleepDeficitScore: number;
    deepRestHours: number;
    totalSleepHours: number;
}
export interface NotificationAnalysis {
    responseTimeAverage: number;
    frequency: bigint;
}
export enum AppCategory {
    productive = "productive",
    distracting = "distracting"
}
export enum BreakType {
    walkBreak = "walkBreak",
    deskRecovery = "deskRecovery"
}
export enum NegativePattern {
    distractionSpikes = "distractionSpikes",
    lateNightFatigue = "lateNightFatigue",
    frequentSwitching = "frequentSwitching"
}
export enum PositivePattern {
    reducedDistractions = "reducedDistractions",
    workConsistency = "workConsistency",
    healthyBreaks = "healthyBreaks"
}
export enum SessionType {
    focus = "focus",
    rest = "rest",
    distraction = "distraction"
}
export enum StreakType {
    deepWorkCompletion = "deepWorkCompletion",
    focusStreak = "focusStreak",
    distractionResistance = "distractionResistance"
}
export interface backendInterface {
    addAchievement(achievement: Achievement): Promise<void>;
    generateReport(patterns: Array<Pattern>): Promise<Report>;
    getAllBurnoutCalculations(): Promise<Array<[Principal, Array<BurnoutCalculation>]>>;
    getAllReports(): Promise<Array<Report>>;
    getBurnoutCalculations(): Promise<Array<BurnoutCalculation>>;
    getFocusScores(): Promise<Array<FocusScore>>;
    getReportById(reportId: bigint): Promise<Report | null>;
    recordBreak(breakSession: BreakSession): Promise<void>;
    recordBurnoutCalculation(calculation: BurnoutCalculation): Promise<void>;
    recordContextSwitch(): Promise<void>;
    recordFocusScore(distractionScore: bigint, tabSwitchCount: bigint, timeAway: bigint): Promise<void>;
    recordSession(session: Session): Promise<void>;
    recordSwitch(contextSwitch: ContextSwitch): Promise<void>;
    startFocusSession(): Promise<void>;
}
