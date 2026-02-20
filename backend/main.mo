import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";



actor {
  type Session = {
    timestamp : Time.Time;
    appName : Text;
    category : AppCategory;
    duration : Nat;
    sessionType : SessionType;
  };

  type AppCategory = {
    #productive;
    #distracting;
  };

  type SessionType = {
    #focus;
    #distraction;
    #rest;
  };

  type ContextSwitch = {
    timestamp : Time.Time;
    sourceApp : Text;
    targetApp : Text;
  };

  type BreakSession = {
    startTime : Time.Time;
    endTime : Time.Time;
    breakType : BreakType;
    timerSetting : TimerSetting;
    isRestorative : Bool;
  };

  type BreakType = {
    #deskRecovery;
    #walkBreak;
  };

  type TimerSetting = {
    duration : Nat;
    notification : Bool;
  };

  type Achievement = {
    streakType : StreakType;
    milestone : Nat;
    isDeepWork : Bool;
    streakStart : Time.Time;
    streakEnd : Time.Time;
  };

  type StreakType = {
    #focusStreak;
    #distractionResistance;
    #deepWorkCompletion;
  };

  type Report = {
    timestamp : Time.Time;
    patterns : [Pattern];
  };

  type Pattern = {
    #positive : PositivePattern;
    #negative : NegativePattern;
  };

  type PositivePattern = {
    #workConsistency;
    #healthyBreaks;
    #reducedDistractions;
  };

  type NegativePattern = {
    #lateNightFatigue;
    #frequentSwitching;
    #distractionSpikes;
  };

  type FocusScore = {
    timestamp : Time.Time;
    distractionScore : Nat;
    tabSwitchCount : Nat;
    timeAway : Nat;
  };

  type ScoreWindow = {
    start : Time.Time;
    end : Time.Time;
  };

  type BurnoutCalculation = {
    timestamp : Time.Time;
    previousIndex : Nat;
    currentIndex : Nat;
    focusSessionTimestamps : [Time.Time];
    switchCount : Nat;
    breakAnalysis : BreakAnalysis;
    sleepAnalysis : SleepAnalysis;
    notificationAnalysis : NotificationAnalysis;
  };

  type BreakAnalysis = {
    totalBreaks : Nat;
    deskRecoveries : Nat;
    walkBreaks : Nat;
    restorativeRatio : Float;
  };

  type SleepAnalysis = {
    totalSleepHours : Float;
    deepRestHours : Float;
    sleepDeficitScore : Float;
  };

  type NotificationAnalysis = {
    frequency : Nat;
    responseTimeAverage : Float;
  };

  var nextReportId = 0 : Nat;
  let sessions = Map.empty<Principal, List.List<Session>>();
  let switches = Map.empty<Principal, List.List<ContextSwitch>>();
  let achievements = Map.empty<Principal, List.List<Achievement>>();
  let breaks = Map.empty<Principal, List.List<BreakSession>>();
  let reports = Map.empty<Nat, Report>();
  let focusScores = Map.empty<Principal, List.List<FocusScore>>();
  let scoreWindows = Map.empty<Principal, ScoreWindow>();
  let burnoutCalculations = Map.empty<Principal, List.List<BurnoutCalculation>>();

  public shared ({ caller }) func recordSession(session : Session) : async () {
    let existingSessions = switch (sessions.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<Session>() };
    };
    existingSessions.add(session);
    sessions.add(caller, existingSessions);
  };

  public shared ({ caller }) func recordSwitch(contextSwitch : ContextSwitch) : async () {
    let existingSwitches = switch (switches.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<ContextSwitch>() };
    };
    existingSwitches.add(contextSwitch);
    switches.add(caller, existingSwitches);
  };

  public shared ({ caller }) func addAchievement(achievement : Achievement) : async () {
    let existingAchievements = switch (achievements.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<Achievement>() };
    };
    existingAchievements.add(achievement);
    achievements.add(caller, existingAchievements);
  };

  public shared ({ caller }) func recordBreak(breakSession : BreakSession) : async () {
    let existingBreaks = switch (breaks.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<BreakSession>() };
    };
    existingBreaks.add(breakSession);
    breaks.add(caller, existingBreaks);
  };

  public shared ({ caller }) func generateReport(patterns : [Pattern]) : async Report {
    let report : Report = {
      timestamp = Time.now();
      patterns;
    };
    reports.add(nextReportId, report);
    nextReportId += 1;
    report;
  };

  public query ({ caller }) func getAllReports() : async [Report] {
    reports.values().toArray();
  };

  public shared ({ caller }) func recordContextSwitch() : async () {
    let lastApp = "App1";
    let newApp = "App2";
    let newSwitch : ContextSwitch = {
      timestamp = 1718151800_00;
      sourceApp = lastApp;
      targetApp = newApp;
    };
    await recordSwitch(newSwitch);
  };

  public query ({ caller }) func getReportById(reportId : Nat) : async ?Report {
    switch (reports.get(reportId)) {
      case (?report) { ?report };
      case (null) { null };
    };
  };

  public shared ({ caller }) func startFocusSession() : async () {
    let now = Time.now();
    scoreWindows.add(
      caller,
      {
        start = now;
        end = now + 10_000_000_000; // 10 seconds in nanoseconds
      },
    );
  };

  public shared ({ caller }) func recordFocusScore(distractionScore : Nat, tabSwitchCount : Nat, timeAway : Nat) : async () {
    let newScore : FocusScore = {
      timestamp = Time.now();
      distractionScore;
      tabSwitchCount;
      timeAway;
    };

    let existingScores = switch (focusScores.get(caller)) {
      case (?scores) { scores };
      case (null) { List.empty<FocusScore>() };
    };
    existingScores.add(newScore);
    focusScores.add(caller, existingScores);
  };

  public query ({ caller }) func getFocusScores() : async [FocusScore] {
    switch (focusScores.get(caller)) {
      case (?scores) { scores.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func recordBurnoutCalculation(calculation : BurnoutCalculation) : async () {
    let existingCalcs = switch (burnoutCalculations.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<BurnoutCalculation>() };
    };
    existingCalcs.add(calculation);
    burnoutCalculations.add(caller, existingCalcs);
  };

  public query ({ caller }) func getBurnoutCalculations() : async [BurnoutCalculation] {
    switch (burnoutCalculations.get(caller)) {
      case (?calcs) { calcs.toArray() };
      case (null) { [] };
    };
  };

  public query func getAllBurnoutCalculations() : async [(Principal, [BurnoutCalculation])] {
    let entries = burnoutCalculations.toArray();
    entries.map(
      func(tuple) {
        let (principal, list) = tuple;
        (principal, list.toArray());
      }
    );
  };
};
