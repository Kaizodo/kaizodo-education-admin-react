export const enum ExamSubmitAction {
    Exit = 0,
    Submit = 1,
    WindowResize = 2,
    FullscreenExit = 3,
    TabSwitch = 4,
    WindowBlur = 5,
    DevToolsOpen = 6,
    IdleTimeout = 7,
    NetworkDisconnect = 8,
    MultipleLogin = 9,
    ForbiddenKey = 10,
}

export const ExamSubmitActionArray = [
    { id: ExamSubmitAction.Exit, name: 'Exit', description: 'User closed/exited exam' },
    { id: ExamSubmitAction.Submit, name: 'Submit', description: 'Manual submit' },
    { id: ExamSubmitAction.WindowResize, name: 'Window Resize', description: 'User resized window' },
    { id: ExamSubmitAction.FullscreenExit, name: 'Fullscreen Exit', description: 'User exited fullscreen' },
    { id: ExamSubmitAction.TabSwitch, name: 'Tab Switch', description: 'User switched tab / lost focus' },
    { id: ExamSubmitAction.WindowBlur, name: 'Window Blur', description: 'Window lost focus (alt+tab, minimize)' },
    { id: ExamSubmitAction.DevToolsOpen, name: 'DevTools Open', description: 'DevTools detected (cheating attempt)' },
    { id: ExamSubmitAction.IdleTimeout, name: 'Idle Timeout', description: 'User inactive for too long' },
    { id: ExamSubmitAction.NetworkDisconnect, name: 'Network Disconnect', description: 'Network lost' },
    { id: ExamSubmitAction.MultipleLogin, name: 'Multiple Login', description: 'Same account opened elsewhere' },
    { id: ExamSubmitAction.ForbiddenKey, name: 'Forbidden Key', description: 'Restricted keys pressed (copy, print screen, etc.)' },
];

export function getExamSubmitAction(id: ExamSubmitAction) {
    return ExamSubmitActionArray.find(a => a.id === id) || null;
}




export const enum ExamViolationActionStatus {
    Pending = 0,
    Lifted = 1,
    Banned = 2
}

export const ExamViolationActionStatusArray = [
    { id: ExamViolationActionStatus.Pending, name: 'Pending', description: 'Action is pending review/decision' },
    { id: ExamViolationActionStatus.Lifted, name: 'Lifted', description: 'Violation action lifted/cleared' },
    { id: ExamViolationActionStatus.Banned, name: 'Banned', description: 'User is banned due to violation' },
];

export function getExamViolationActionStatus(id: ExamViolationActionStatus) {
    if (!id) {
        return ExamViolationActionStatusArray.find(s => s.id === ExamViolationActionStatus.Pending);
    }
    return ExamViolationActionStatusArray.find(s => s.id === id) || null;
}

export const enum ExamTheme {
    ION = 0,
    NTA = 1
}


export const enum ExamType {
    Free = 0,
    AIR = 1,
    Open = 2,
    Quiz = 3
}

export const ExamTypeArray = [
    { id: ExamType.Free, name: 'Free', description: 'Anyone can signup and attempt the exam without payment' },
    { id: ExamType.AIR, name: 'AIR', description: 'ALL INDIA RANK, ranks will be calculated in this type of exam' },
    { id: ExamType.Open, name: 'Open', description: 'Unranked exams and without slot booking exams' },
    { id: ExamType.Quiz, name: 'Quiz', description: 'Quick testing with limited number of answering options.' },
];

export function getExamTypeName(id: ExamType) {
    return ExamTypeArray.find(a => a.id === id) || null;
}