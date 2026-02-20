export const COPY = {
  app: {
    name: 'Focus Guardian',
    tagline: 'Your productivity coach',
  },
  dashboard: {
    welcome: 'Welcome back!',
    subtitle: "Let's review your focus journey and celebrate your progress.",
  },
  warnings: {
    firstThreshold: {
      title: 'Focus Check-In',
      message: 'You might be experiencing cognitive fatigue.',
      suggestion: 'Consider taking a short desk recovery break to reset your focus.',
    },
    secondThreshold: {
      title: 'High Cognitive Load',
      message: 'Your burnout index is elevated.',
      suggestion: 'A break is strongly recommended to maintain productivity.',
    },
  },
  blocking: {
    title: 'Focus Session Required',
    subtitle: 'Complete a productive work session to unlock distracting applications',
    tips: [
      'Close unnecessary tabs and applications',
      'Focus on a single task',
      'Minimize context switching',
      'Take deep breaths if you feel restless',
    ],
  },
  breaks: {
    deskRecovery: {
      title: 'Desk Recovery',
      subtitle: 'Take a mindful break with guided breathing exercises',
      benefits: [
        {
          title: 'Reduces Mental Fatigue',
          description: 'Short breathing exercises help reset your cognitive resources',
        },
        {
          title: 'Improves Focus',
          description: 'Mindful breathing enhances concentration and attention span',
        },
        {
          title: 'Lowers Stress',
          description: 'Activates your parasympathetic nervous system for relaxation',
        },
      ],
    },
    walkBreak: {
      title: 'Walk Break',
      subtitle: 'Set a timer for your walk and return before the alarm sounds',
      tips: [
        'Leave your phone at your desk',
        'Get some fresh air if possible',
        'Stretch your legs and back',
        'Stay hydrated',
      ],
      benefits: [
        'Increases blood flow to the brain',
        'Reduces eye strain from screens',
        'Improves mood and energy',
        'Prevents prolonged sitting',
      ],
    },
  },
};
