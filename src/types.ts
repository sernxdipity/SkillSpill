export type Screen =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'step1_location'
  | 'step2_interests'
  | 'step3_family'
  | 'create_family'
  | 'family_ready'
  | 'all_set'
  | 'main_app'
  | 'community_groups';

export type MainTab = 'home' | 'activities' | 'quests' | 'profile';

export interface GroupActivity {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  location?: string;
  attendeesCount: number;
  isAttending?: boolean;
}

export interface GroupDiscussionMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  avatarIcon?: string;
  message: string;
  timestamp: number;
  timeAgoStr: string;
  likes?: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  category: string;
  categoryKey?: string;
  interestId?: string; // links to onboarding interests (cooking, gardening, arts, tech, fitness, etc.)
  neighbourhood: string;
  postcode?: string;
  membersCount: number;
  isJoined: boolean;
  imageUrl: string;
  description: string;
  upcomingActivity?: {
    title: string;
    dateStr: string;
    timeStr: string;
  };
  meetingFrequency?: string;
  activities?: GroupActivity[];
  discussions?: GroupDiscussionMessage[];
  rules?: string[];
}

export type ActivityMode = 'help' | 'skills';

export interface HelpRequest {
  id: string;
  title: string;
  category: string;
  timeStr: string;
  requester: string;
  requesterInitials: string;
  credits: number;
  icon: string;
  description: string;
  status: 'open' | 'accepted' | 'completed';
}

export interface Workshop {
  id: string;
  title: string;
  category: string;
  timeStr: string;
  host: string;
  joined: number;
  max: number;
  status: 'Waiting for Participants' | 'Confirmed' | string;
  icon: string;
  description: string;
  isUserJoined: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  creditsEarned: number;
  isCurrentUser?: boolean;
}

export interface FamilyGroup {
  name: string;
  code: string;
  isAdmin: boolean;
  sharedCredits: number;
  members: FamilyMember[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  rewardCredits: number;
  rewardBadge?: string;
  claimed: boolean;
}

export interface QuestParticipant {
  id: string;
  name: string;
  avatarInitials: string;
  avatarIcon?: string;
  contributedAmount: number;
  role?: string;
  isCurrentUser?: boolean;
}

export interface CommunityQuest {
  id: string;
  title: string;
  category: 'fitness' | 'green' | 'learning' | 'eco';
  categoryLabelKey: string;
  tagColor?: string;
  description: string;
  detailedRules: string;
  timeStr: string;
  unit: string;
  currentProgress: number;
  target: number;
  userContribution: number;
  isJoined: boolean;
  isCompleted: boolean;
  completionCelebrated?: boolean;
  daysRemaining: number;
  totalDurationDays: number;
  currentDay: number;
  participantsCount: number;
  participants: QuestParticipant[];
  unlistedParticipantsContribution?: number;
  icon: string;
  iconBg?: string;
  rewardBadgeTitle: string;
  rewardBadgeIcon: string;
  lastMilestoneCelebrated?: 0 | 25 | 50 | 75 | 100;
  illustrationUrl?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  dateUnlocked?: string;
}

export interface Transaction {
  id: string;
  title: string;
  member: string;
  amount: number;
  type: 'earn' | 'spend';
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'credit' | 'activity' | 'family';
  deedId?: string;
}

export type GoodDeedType =
  | 'help_completed'
  | 'workshop_published'
  | 'workshop_completed'
  | 'volunteer_completed'
  | 'group_quest_completed';

export interface GoodDeed {
  id: string;
  sourceId?: string;
  type: GoodDeedType;
  actorName: string;
  recipientName?: string;
  activityTitle: string;
  templateKey: string;
  timeKey: string;
  timestamp: number;
  icon: string;
  iconBg?: string;
  celebrations?: number;
  celebratedBy?: string[];
  isCurrentUser?: boolean;
  hidden?: boolean;
}

export interface DeedComment {
  id: string;
  deedId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  message: string;
  createdAt: number;
  updatedAt?: number;
  reported?: boolean;
  isCurrentUser?: boolean;
}

