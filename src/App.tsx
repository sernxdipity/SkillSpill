/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSavedLanguage, setSavedLanguage } from './i18n';
import { Screen, MainTab, HelpRequest, Workshop, FamilyGroup, Quest, Badge, Transaction, AppNotification, GoodDeed, DeedComment, CommunityQuest, CommunityGroup } from './types';
import {
  INITIAL_HELP_REQUESTS,
  INITIAL_WORKSHOPS,
  createInitialFamilyGroup,
  INITIAL_QUESTS,
  INITIAL_COMMUNITY_QUESTS,
  INITIAL_BADGES,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_GOOD_DEEDS,
  createInitialGoodDeeds,
  INITIAL_DEED_COMMENTS,
  INITIAL_COMMUNITY_GROUPS,
} from './data/initialData';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { Step1LocationScreen } from './screens/Step1LocationScreen';
import { Step2InterestsScreen } from './screens/Step2InterestsScreen';
import { Step3FamilyScreen } from './screens/Step3FamilyScreen';
import { CreateFamilyScreen } from './screens/CreateFamilyScreen';
import { FamilyReadyScreen } from './screens/FamilyReadyScreen';
import { AllSetScreen } from './screens/AllSetScreen';
import { ActivitiesScreen } from './screens/ActivitiesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { HomeScreen } from './screens/HomeScreen';
import { QuestsScreen } from './screens/QuestsScreen';

import { LanguageModal } from './components/LanguageModal';
import { NotificationsModal } from './components/NotificationsModal';
import { NeighbourhoodModal } from './components/NeighbourhoodModal';
import { GoodDeedsModal } from './components/GoodDeedsModal';
import { DeedCommentsSheet } from './components/DeedCommentsSheet';
import { ScreenSwitcherBanner } from './components/ScreenSwitcherBanner';
import { GroupDetailsModal } from './components/GroupDetailsModal';
import { CommunityGroupsModal } from './components/CommunityGroupsModal';

import { formatNameFromEmail } from './utils/nameHelper';

export default function App() {
  const { t, i18n } = useTranslation();

  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentTab, setCurrentTab] = useState<MainTab>('activities');

  // User accounts registry (remember registered names by email)
  const [userAccounts, setUserAccounts] = useState<Record<string, string>>({
    'leemiaojuan@gmail.com': 'Miaojuan Lee',
  });

  // User & community state (defaults to current user name)
  const [userName, setUserName] = useState('Miaojuan Lee');
  const [postcode, setPostcode] = useState('50480');
  const [neighbourhood, setNeighbourhood] = useState('Maple Heights');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['cooking', 'gardening']);
  const [credits, setCredits] = useState(120);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(() => createInitialFamilyGroup('Miaojuan Lee'));

  const handleUpdateUserName = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const oldName = userName;
    setUserName(trimmed);
    setFamilyGroup((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.map((m) =>
          m.isCurrentUser || m.name === oldName
            ? {
                ...m,
                name: trimmed,
                avatarInitials: trimmed
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2),
              }
            : m
        ),
      };
    });
    setTransactions((prev) =>
      prev.map((tItem) => (tItem.member === oldName ? { ...tItem, member: trimmed } : tItem))
    );
  };

  // App data state
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(INITIAL_HELP_REQUESTS);
  const [workshops, setWorkshops] = useState<Workshop[]>(INITIAL_WORKSHOPS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  // Community Quests state with persistence (Single shared source of truth for targets and progress)
  const [communityQuests, setCommunityQuests] = useState<CommunityQuest[]>(() => {
    try {
      const saved = localStorage.getItem('skillspill_community_quests');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMUNITY_QUESTS;
  });

  // Sync community quests to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('skillspill_community_quests', JSON.stringify(communityQuests));
    } catch {
      // ignore
    }
  }, [communityQuests]);

  // Milestone celebration modal state
  const [recentMilestone, setRecentMilestone] = useState<{
    quest: CommunityQuest;
    level: 25 | 50 | 75 | 100;
  } | null>(null);

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Community Good Deeds state with persistence
  const [goodDeeds, setGoodDeeds] = useState<GoodDeed[]>(() => {
    try {
      const saved = localStorage.getItem('skillspill_good_deeds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_GOOD_DEEDS;
  });

  const [feedSharingOptIn, setFeedSharingOptIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('skillspill_feed_opt_in');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [showGoodDeedsModal, setShowGoodDeedsModal] = useState(false);

  // Sync good deeds to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('skillspill_good_deeds', JSON.stringify(goodDeeds));
    } catch {
      // ignore
    }
  }, [goodDeeds]);

  // Celebrations state (track which deed IDs current user celebrated, persisted in localStorage)
  const [celebratedDeedIds, setCelebratedDeedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('skillspill_user_celebrations');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch {
      // ignore
    }
    return new Set(['deed-2']); // Initial state: user celebrated Marcus Wong's workshop
  });

  // Sync celebrations to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(
        'skillspill_user_celebrations',
        JSON.stringify(Array.from(celebratedDeedIds))
      );
    } catch {
      // ignore
    }
  }, [celebratedDeedIds]);

  // Comments state with localStorage persistence
  const [deedComments, setDeedComments] = useState<DeedComment[]>(() => {
    try {
      const saved = localStorage.getItem('skillspill_deed_comments');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_DEED_COMMENTS;
  });

  // Sync deed comments to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('skillspill_deed_comments', JSON.stringify(deedComments));
    } catch {
      // ignore
    }
  }, [deedComments]);

  // Active deed comments bottom sheet
  const [activeCommentsDeed, setActiveCommentsDeed] = useState<GoodDeed | null>(null);

  // Map of comment counts per deed
  const commentsCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    deedComments.forEach((c) => {
      map[c.deedId] = (map[c.deedId] || 0) + 1;
    });
    return map;
  }, [deedComments]);

  // Community Groups state with persistence
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>(() => {
    try {
      const saved = localStorage.getItem('skillspill_community_groups');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMUNITY_GROUPS;
  });

  // Sync community groups to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('skillspill_community_groups', JSON.stringify(communityGroups));
    } catch {
      // ignore
    }
  }, [communityGroups]);

  // Active group details & All Groups modal states
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<CommunityGroup | null>(null);
  const [showAllGroupsModal, setShowAllGroupsModal] = useState(false);

  // Modals & Localization - restored directly from saved preference
  const [currentLang, setCurrentLang] = useState<string>(() => getSavedLanguage());
  const [showLangModal, setShowLangModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showNeighbourhoodModal, setShowNeighbourhoodModal] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleSelectLang = (newLang: string) => {
    const code = newLang.toUpperCase();
    setCurrentLang(code);
    setSavedLanguage(code);
    i18n.changeLanguage(code);
  };

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: AppNotification) => {
    if (notif.deedId) {
      const found = goodDeeds.find((d) => d.id === notif.deedId);
      if (found) {
        setActiveCommentsDeed(found);
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setShowNotificationsModal(false);
  };

  // Community Feed & Privacy Handlers
  const handleToggleFeedSharing = (enabled: boolean) => {
    setFeedSharingOptIn(enabled);
    try {
      localStorage.setItem('skillspill_feed_opt_in', JSON.stringify(enabled));
    } catch {
      // ignore
    }
    showToast(enabled ? t('goodDeeds.optInActive') : t('goodDeeds.optInPaused'));
  };

  const handleHideDeed = (deedId: string) => {
    setGoodDeeds((prev) =>
      prev.map((d) => (d.id === deedId ? { ...d, hidden: true } : d))
    );
    showToast(t('goodDeeds.activityHidden'));
  };

  const handleRestoreDeed = (deedId: string) => {
    setGoodDeeds((prev) =>
      prev.map((d) => (d.id === deedId ? { ...d, hidden: false } : d))
    );
  };

  // Celebrate with Duolingo-inspired toggle & self-celebration prevention
  const handleCelebrateDeed = (deedId: string) => {
    const targetDeed = goodDeeds.find((d) => d.id === deedId);
    if (!targetDeed) return;

    // Do not allow residents to celebrate their own posts
    const isOwn = targetDeed.isCurrentUser || targetDeed.actorName === userName;
    if (isOwn) {
      showToast(t('goodDeeds.celebrateSelfError'));
      return;
    }

    const wasCelebrated = celebratedDeedIds.has(deedId);

    if (wasCelebrated) {
      // Remove celebration
      setCelebratedDeedIds((prev) => {
        const next = new Set(prev);
        next.delete(deedId);
        return next;
      });
      setGoodDeeds((prev) =>
        prev.map((d) =>
          d.id === deedId
            ? { ...d, celebrations: Math.max(0, (d.celebrations || 1) - 1) }
            : d
        )
      );
      showToast(t('goodDeeds.celebrateRemoved'));
    } else {
      // Add celebration
      setCelebratedDeedIds((prev) => {
        const next = new Set(prev);
        next.add(deedId);
        return next;
      });
      setGoodDeeds((prev) =>
        prev.map((d) =>
          d.id === deedId
            ? { ...d, celebrations: (d.celebrations || 0) + 1 }
            : d
        )
      );
      showToast(t('goodDeeds.celebrateSuccess', { name: targetDeed.actorName }));
    }
  };

  // Comment Handlers
  const handleAddComment = (deedId: string, message: string) => {
    const targetDeed = goodDeeds.find((d) => d.id === deedId);
    const newComment: DeedComment = {
      id: `comment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      deedId,
      authorId: `user-${userName.toLowerCase().replace(/\s+/g, '-')}`,
      authorName: userName,
      authorInitials: userName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      message,
      createdAt: Date.now(),
      isCurrentUser: true,
    };

    setDeedComments((prev) => [...prev, newComment]);
    showToast(t('goodDeeds.commentAddedToast'));

    // In-app notification for post author (if someone else comments)
    if (targetDeed && targetDeed.actorName !== userName) {
      setTimeout(() => {
        const notifId = `notif-reply-${Date.now()}`;
        const simulatedNotif: AppNotification = {
          id: notifId,
          title: `${targetDeed.actorName} replied! 💬`,
          message: `${targetDeed.actorName} appreciated your kind words on the community deed!`,
          time: 'Just now',
          read: false,
          type: 'activity',
          deedId: targetDeed.id,
        };
        setNotifications((prev) => [simulatedNotif, ...prev]);
      }, 3500);
    }
  };

  const handleEditComment = (commentId: string, newMessage: string) => {
    setDeedComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, message: newMessage, updatedAt: Date.now() } : c
      )
    );
    showToast(t('goodDeeds.commentUpdatedToast'));
  };

  const handleDeleteComment = (commentId: string) => {
    const currentUserId = `user-${userName.toLowerCase().replace(/\s+/g, '-')}`;
    const comment = deedComments.find((c) => c.id === commentId);

    // Enforce comment ownership check
    if (comment) {
      const isOwner =
        comment.authorId === currentUserId ||
        comment.isCurrentUser === true ||
        (Boolean(comment.authorName) &&
          Boolean(userName) &&
          comment.authorName.trim().toLowerCase() === userName.trim().toLowerCase());
      if (!isOwner) {
        showToast(t('goodDeeds.commentDeleteFailed', { defaultValue: 'Failed to delete comment' }));
        return;
      }
    }

    setDeedComments((prev) => prev.filter((c) => c.id !== commentId));
    showToast(t('goodDeeds.commentDeletedSuccess', { defaultValue: 'Comment deleted successfully.' }));
  };

  const handleReportComment = (commentId: string) => {
    setDeedComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, reported: true } : c))
    );
    showToast(t('goodDeeds.commentReportedToast'));
  };

  const addGoodDeed = (deed: Omit<GoodDeed, 'id' | 'timestamp'> & { sourceId?: string }) => {
    if (!feedSharingOptIn) return;

    setGoodDeeds((prev) => {
      if (deed.sourceId && prev.some((d) => d.sourceId === deed.sourceId)) {
        return prev;
      }
      const newDeed: GoodDeed = {
        ...deed,
        id: `deed-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: Date.now(),
        celebrations: deed.celebrations || 0,
      };
      return [newDeed, ...prev];
    });
  };

  const handleSimulateDeed = () => {
    const sampleSimulations = [
      {
        type: 'help_completed' as const,
        actorName: 'Aisha',
        recipientName: 'Uncle David',
        activityTitle: 'watering balcony orchids',
        templateKey: 'help_thanked',
        icon: 'potted_plant',
        iconBg: '#e6f3f1',
      },
      {
        type: 'volunteer_completed' as const,
        actorName: 'Daniel Lim',
        activityTitle: 'Community Garden Composting',
        templateKey: 'volunteer_completed',
        icon: 'recycling',
        iconBg: '#FEF3D6',
      },
      {
        type: 'workshop_published' as const,
        actorName: 'Chef Danial',
        activityTitle: 'Nyonya Spice Blending Workshop',
        templateKey: 'workshop_published',
        icon: 'skillet',
        iconBg: '#FEF3D6',
      },
      {
        type: 'group_quest_completed' as const,
        actorName: 'TTDI Green Volunteers',
        activityTitle: 'Township Tree Planting Day',
        templateKey: 'group_quest_completed',
        icon: 'forest',
        iconBg: '#C0DDDA',
      },
      {
        type: 'help_completed' as const,
        actorName: userName,
        activityTitle: 'home WiFi printer configuration',
        templateKey: 'daniel_phone',
        icon: 'devices',
        iconBg: '#F4F2EE',
        isCurrentUser: true,
      },
    ];

    const pick = sampleSimulations[Math.floor(Math.random() * sampleSimulations.length)];
    addGoodDeed({
      ...pick,
      sourceId: `sim-${Date.now()}`,
      timeKey: 'just_now',
    });
    showToast(t('goodDeeds.allFeedTitle'));
  };

  // Help Request Actions
  const handleAddHelpRequest = (req: Omit<HelpRequest, 'id' | 'status'>) => {
    const newReq: HelpRequest = {
      ...req,
      id: `help-${Date.now()}`,
      status: 'open',
    };
    setHelpRequests((prev) => [newReq, ...prev]);
    showToast(t('common.postedHelpRequest', { title: newReq.title }));
  };

  const handleAcceptHelpRequest = (id: string) => {
    const target = helpRequests.find((h) => h.id === id);
    if (!target) return;

    setHelpRequests((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: 'accepted' } : h))
    );

    // Reward credits
    setCredits((c) => c + target.credits);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: `Offered Help: ${target.title}`,
        member: userName,
        amount: target.credits,
        type: 'earn',
        date: 'Just now',
      },
      ...prev,
    ]);

    // Update quest progress
    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'quest-1' ? { ...q, progress: Math.min(q.total, q.progress + 1) } : q
      )
    );

    // Trigger Community Good Deed
    addGoodDeed({
      sourceId: `help-${id}`,
      type: 'help_completed',
      actorName: userName,
      recipientName: target.requester,
      activityTitle: target.title.toLowerCase(),
      templateKey:
        target.id === 'help-1'
          ? 'auntie_mei_groceries'
          : target.id === 'help-3'
          ? 'daniel_phone'
          : 'help_thanked',
      timeKey: 'just_now',
      icon: target.icon || 'volunteer_activism',
      iconBg: '#FEF3D6',
      isCurrentUser: true,
    });

    showToast(t('common.youOfferedHelp', { name: target.requester, credits: target.credits }));
  };

  // Workshop Actions
  const handleToggleJoinWorkshop = (id: string) => {
    const target = workshops.find((w) => w.id === id);
    if (!target) return;

    const willJoin = !target.isUserJoined;

    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newJoined = willJoin ? w.joined + 1 : Math.max(1, w.joined - 1);
          return {
            ...w,
            isUserJoined: willJoin,
            joined: newJoined,
            status: newJoined >= w.max ? 'Confirmed' : 'Waiting for Participants',
          };
        }
        return w;
      })
    );

    if (willJoin) {
      addGoodDeed({
        sourceId: `ws-join-${id}-${userName}`,
        type: 'workshop_completed',
        actorName: userName,
        recipientName: target.host,
        activityTitle: target.title,
        templateKey: id === 'ws-1' ? 'sarah_gardening' : 'workshop_completed',
        timeKey: 'just_now',
        icon: target.icon || 'school',
        iconBg: '#e6f3f1',
        isCurrentUser: true,
      });
    }

    showToast(
      willJoin
        ? t('common.joinedWorkshop', { title: target.title })
        : t('common.leftWorkshop', { title: target.title })
    );
  };

  const handleAddWorkshop = (ws: Omit<Workshop, 'id' | 'isUserJoined'>) => {
    const newWs: Workshop = {
      ...ws,
      id: `ws-${Date.now()}`,
      isUserJoined: true,
    };
    setWorkshops((prev) => [newWs, ...prev]);

    // Trigger Community Good Deed for workshop publishing
    addGoodDeed({
      sourceId: `ws-pub-${newWs.id}`,
      type: 'workshop_published',
      actorName: userName,
      activityTitle: newWs.title,
      templateKey: 'workshop_published',
      timeKey: 'just_now',
      icon: newWs.icon || 'school',
      iconBg: '#C0DDDA',
      isCurrentUser: true,
    });

    showToast(t('common.createdWorkshop', { title: newWs.title }));
  };

  // Family Group Actions
  const handleCreateFamilyGroup = (groupName: string) => {
    const newCode = `FAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFamily: FamilyGroup = {
      name: groupName,
      code: newCode,
      isAdmin: true,
      sharedCredits: credits,
      members: [
        {
          id: `mem-${Date.now()}`,
          name: userName,
          role: 'Admin',
          avatarInitials: 'AT',
          creditsEarned: credits,
          isCurrentUser: true,
        },
      ],
    };
    setFamilyGroup(newFamily);
    setCurrentScreen('family_ready');
  };

  const handleJoinFamilyGroup = (code: string) => {
    const joinedFamily: FamilyGroup = {
      name: 'The Happy Family',
      code: code,
      isAdmin: false,
      sharedCredits: credits + 80,
      members: [
        { id: 'mem-1', name: 'Uncle David', role: 'Admin', avatarInitials: 'UD', creditsEarned: 80 },
        { id: 'mem-2', name: userName, role: 'Member', avatarInitials: 'AT', creditsEarned: credits, isCurrentUser: true },
      ],
    };
    setFamilyGroup(joinedFamily);
    showToast(`Successfully joined family group via ${code}!`);
    setCurrentScreen('all_set');
  };

  // Quests claiming
  const handleClaimQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.claimed) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );

    setCredits((c) => c + target.rewardCredits);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: `Claimed Quest: ${target.title}`,
        member: userName,
        amount: target.rewardCredits,
        type: 'earn',
        date: 'Just now',
      },
      ...prev,
    ]);

    // Trigger Community Good Deed for group quest completion
    addGoodDeed({
      sourceId: `quest-${questId}`,
      type: 'group_quest_completed',
      actorName: familyGroup?.name || userName,
      activityTitle: target.title,
      templateKey: questId === 'quest-walk' ? 'weekend_jogging' : 'group_quest_completed',
      timeKey: 'just_now',
      icon: 'emoji_events',
      iconBg: '#FEF7DF',
      isCurrentUser: true,
    });

    showToast(t('common.claimedQuestToast', { credits: target.rewardCredits }));
  };

  // Community Quests Handlers
  const handleLogQuestContribution = (questId: string, amount: number, consentShare: boolean) => {
    const targetQuest = communityQuests.find((q) => q.id === questId);
    if (!targetQuest) return;

    if (!targetQuest.isJoined) {
      showToast(t('quests.joinToLogPrompt', { defaultValue: 'Join this quest to contribute.' }));
      return;
    }

    const previousProgress = targetQuest.currentProgress;
    const newProgress = previousProgress + amount;
    const previousPct = Math.round((previousProgress / targetQuest.target) * 100);
    const newPct = Math.round((newProgress / targetQuest.target) * 100);
    const newIsCompleted = newProgress >= targetQuest.target;

    // Check milestone crossings (25%, 50%, 75%, 100%)
    let reachedMilestoneLevel: 25 | 50 | 75 | 100 | null = null;
    const milestoneLevels: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
    for (const lvl of milestoneLevels) {
      if (previousPct < lvl && newPct >= lvl) {
        reachedMilestoneLevel = lvl;
      }
    }

    setCommunityQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const userParticipant = q.participants.find((p) => p.isCurrentUser || p.name === userName);
          let updatedParticipants = [...q.participants];

          if (userParticipant) {
            updatedParticipants = updatedParticipants.map((p) =>
              p.id === userParticipant.id
                ? { ...p, contributedAmount: p.contributedAmount + amount }
                : p
            );
          } else {
            updatedParticipants.unshift({
              id: `p-${Date.now()}`,
              name: userName,
              avatarInitials: userName
                .split(' ')
                .map((p) => p[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
              avatarIcon: 'person',
              contributedAmount: amount,
              role: 'You',
              isCurrentUser: true,
            });
          }

          return {
            ...q,
            currentProgress: newProgress,
            userContribution: q.userContribution + amount,
            isCompleted: newIsCompleted,
            lastMilestoneCelebrated: reachedMilestoneLevel || q.lastMilestoneCelebrated,
            participants: updatedParticipants,
          };
        }
        return q;
      })
    );

    // If 100% completed, add achievement to Community Good Deeds (preventing duplicates via sourceId)
    if (newIsCompleted && !targetQuest.isCompleted && consentShare) {
      const actorName = targetQuest.id === 'quest-walk-weekly'
        ? 'The Walking Team'
        : `${targetQuest.title} Group`;

      addGoodDeed({
        sourceId: `quest-complete-${targetQuest.id}`,
        type: 'group_quest_completed',
        actorName,
        activityTitle: targetQuest.title,
        templateKey: 'group_quest_completed',
        timeKey: 'just_now',
        icon: targetQuest.icon,
        iconBg: targetQuest.iconBg || '#FEF3D6',
        isCurrentUser: true,
      });

      // Unlock participation badge (No spendable time credits awarded for self-reported entries)
      setBadges((prev) => [
        {
          id: `badge-quest-${targetQuest.id}`,
          title: targetQuest.rewardBadgeTitle,
          description: `Participated in the community challenge: ${targetQuest.title}`,
          icon: targetQuest.rewardBadgeIcon,
          isUnlocked: true,
          dateUnlocked: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
        ...prev.filter((b) => b.id !== `badge-quest-${targetQuest.id}`),
      ]);
    }

    if (reachedMilestoneLevel) {
      setRecentMilestone({
        quest: {
          ...targetQuest,
          currentProgress: newProgress,
          userContribution: targetQuest.userContribution + amount,
          isCompleted: newIsCompleted,
        },
        level: reachedMilestoneLevel,
      });
    }

    showToast(
      targetQuest.unit === 'steps'
        ? t('quests.stepsLoggedToast', { steps: amount.toLocaleString() })
        : t('quests.contributionLoggedToast', { amount: amount.toLocaleString(), unit: targetQuest.unit })
    );
  };

  const handleToggleJoinQuest = (questId: string, join: boolean) => {
    const targetQuest = communityQuests.find((q) => q.id === questId);
    if (!targetQuest) return;

    setCommunityQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const isUserInList = q.participants.some((p) => p.isCurrentUser || p.name === userName);
          let updatedParticipants = [...q.participants];

          if (join && !isUserInList) {
            updatedParticipants.unshift({
              id: `p-${Date.now()}`,
              name: userName,
              avatarInitials: userName
                .split(' ')
                .map((p) => p[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
              avatarIcon: 'person',
              contributedAmount: 0,
              role: 'You',
              isCurrentUser: true,
            });
          }

          return {
            ...q,
            isJoined: join,
            participantsCount: join
              ? q.participantsCount + (isUserInList ? 0 : 1)
              : Math.max(1, q.participantsCount - 1),
            participants: updatedParticipants,
          };
        }
        return q;
      })
    );

    showToast(
      join
        ? t('common.joinedWorkshop', { title: targetQuest.title })
        : t('common.leftWorkshop', { title: targetQuest.title })
    );
  };

  // Community Groups Handlers
  const handleToggleJoinGroup = (groupId: string, join: boolean) => {
    const target = communityGroups.find((g) => g.id === groupId);
    if (!target) return;

    setCommunityGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            isJoined: join,
            membersCount: join ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
          };
        }
        return g;
      })
    );

    // Keep active details modal in sync
    setSelectedGroupDetails((curr) => {
      if (curr && curr.id === groupId) {
        return {
          ...curr,
          isJoined: join,
          membersCount: join ? curr.membersCount + 1 : Math.max(1, curr.membersCount - 1),
        };
      }
      return curr;
    });

    showToast(
      join
        ? t('groups.groupJoinedToast', { name: target.name, defaultValue: `Joined ${target.name}! 🎉` })
        : t('groups.groupLeftToast', { name: target.name, defaultValue: `Left ${target.name}.` })
    );
  };

  const handleCreateCommunityGroup = (newGroupData: Omit<CommunityGroup, 'id' | 'membersCount' | 'isJoined'>) => {
    const newGroup: CommunityGroup = {
      ...newGroupData,
      id: `group-${Date.now()}`,
      membersCount: 1,
      isJoined: true,
    };

    setCommunityGroups((prev) => [newGroup, ...prev]);
    showToast(t('groups.groupCreatedToast', { name: newGroup.name, defaultValue: `Circle "${newGroup.name}" created! 🎉` }));
  };

  const handlePostGroupDiscussion = (groupId: string, message: string) => {
    const initials = userName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMsg = {
      id: `disc-${Date.now()}`,
      authorId: `user-${userName.toLowerCase().replace(/\s+/g, '-')}`,
      authorName: userName,
      authorInitials: initials,
      avatarIcon: 'person',
      message,
      timestamp: Date.now(),
      timeAgoStr: 'Just now',
      likes: 0,
    };

    setCommunityGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            discussions: [newMsg, ...(g.discussions || [])],
          };
        }
        return g;
      })
    );

    setSelectedGroupDetails((curr) => {
      if (curr && curr.id === groupId) {
        return {
          ...curr,
          discussions: [newMsg, ...(curr.discussions || [])],
        };
      }
      return curr;
    });

    showToast(t('groups.messagePostedToast', { defaultValue: 'Message posted! 💬' }));
  };

  const handleRsvpGroupActivity = (groupId: string, activityId: string) => {
    setCommunityGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId && g.activities) {
          return {
            ...g,
            activities: g.activities.map((a) => {
              if (a.id === activityId) {
                const nextAttending = !a.isAttending;
                return {
                  ...a,
                  isAttending: nextAttending,
                  attendeesCount: nextAttending ? a.attendeesCount + 1 : Math.max(0, a.attendeesCount - 1),
                };
              }
              return a;
            }),
          };
        }
        return g;
      })
    );

    setSelectedGroupDetails((curr) => {
      if (curr && curr.id === groupId && curr.activities) {
        return {
          ...curr,
          activities: curr.activities.map((a) => {
            if (a.id === activityId) {
              const nextAttending = !a.isAttending;
              return {
                ...a,
                isAttending: nextAttending,
                attendeesCount: nextAttending ? a.attendeesCount + 1 : Math.max(0, a.attendeesCount - 1),
              };
            }
            return a;
          }),
        };
      }
      return curr;
    });
  };

  // Quick jump helper for screen navigator
  const handleJumpScreen = (screen: Screen, tab?: MainTab) => {
    setCurrentScreen(screen);
    if (tab) setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#EFEFE9] py-0 md:py-8 px-0 md:px-4 flex flex-col items-center justify-start">
      {/* Screen Navigator Banner at Top */}
      <ScreenSwitcherBanner
        currentScreen={currentScreen}
        currentTab={currentTab}
        onSelectScreen={handleJumpScreen}
      />

      {/* Dynamic Screen Viewport Container */}
      <div className="w-full flex justify-center">
        {/* Screen 1: Welcome Screen */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onGetStarted={() => setCurrentScreen('signup')}
            onLogin={() => setCurrentScreen('login')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Log In Screen */}
        {currentScreen === 'login' && (
          <LoginScreen
            onLoginSuccess={(email) => {
              const cleanEmail = email.trim().toLowerCase();
              const resolvedName = userAccounts[cleanEmail] || formatNameFromEmail(cleanEmail) || userName;
              handleUpdateUserName(resolvedName);
              setCurrentScreen('main_app');
              setCurrentTab('activities');
              showToast(t('common.welcomeBackToast', { name: resolvedName }));
            }}
            onGoToSignUp={() => setCurrentScreen('signup')}
            onBack={() => setCurrentScreen('welcome')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Sign Up Screen */}
        {currentScreen === 'signup' && (
          <SignupScreen
            onSignupSuccess={(name, email) => {
              if (email) {
                setUserAccounts((prev) => ({ ...prev, [email.trim().toLowerCase()]: name }));
              }
              handleUpdateUserName(name);
              setCurrentScreen('step1_location');
              showToast(t('common.welcomeToast', { name }));
            }}
            onGoToLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('welcome')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 2: Step 1 Location */}
        {currentScreen === 'step1_location' && (
          <Step1LocationScreen
            postcode={postcode}
            setPostcode={setPostcode}
            neighbourhood={neighbourhood}
            setNeighbourhood={setNeighbourhood}
            onContinue={() => setCurrentScreen('step2_interests')}
            onBack={() => setCurrentScreen('welcome')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 3: Step 2 Interests */}
        {currentScreen === 'step2_interests' && (
          <Step2InterestsScreen
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
            onContinue={() => setCurrentScreen('step3_family')}
            onSkip={() => setCurrentScreen('step3_family')}
            onBack={() => setCurrentScreen('step1_location')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 4: Step 3 Family Setup */}
        {currentScreen === 'step3_family' && (
          <Step3FamilyScreen
            onCreateFamily={() => setCurrentScreen('create_family')}
            onJoinFamily={handleJoinFamilyGroup}
            onMaybeLater={() => setCurrentScreen('all_set')}
            onBack={() => setCurrentScreen('step2_interests')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 5: Create Family Group */}
        {currentScreen === 'create_family' && (
          <CreateFamilyScreen
            initialName={familyGroup?.name || 'The Happy Family'}
            onCreateSuccess={(name) => handleCreateFamilyGroup(name)}
            onBack={() => setCurrentScreen('step3_family')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 6: Family Ready */}
        {currentScreen === 'family_ready' && (
          <FamilyReadyScreen
            groupName={familyGroup?.name || 'The Happy Family'}
            inviteCode={familyGroup?.code || 'FAM-4826'}
            onContinue={() => setCurrentScreen('all_set')}
            onBack={() => setCurrentScreen('create_family')}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 7: All Set! */}
        {currentScreen === 'all_set' && (
          <AllSetScreen
            neighbourhood={neighbourhood}
            onExplore={() => {
              setCurrentScreen('main_app');
              setCurrentTab('activities');
              showToast(t('common.welcomeHubToast'));
            }}
            currentLang={currentLang}
            onOpenLangModal={() => setShowLangModal(true)}
          />
        )}

        {/* Screen 8 & 9 & Home & Quests: Main App Tabs */}
        {currentScreen === 'main_app' && (
          <>
            {currentTab === 'activities' && (
              <ActivitiesScreen
                userName={userName}
                neighbourhood={neighbourhood}
                onOpenNeighbourhoodModal={() => setShowNeighbourhoodModal(true)}
                onOpenNotifications={() => setShowNotificationsModal(true)}
                unreadCount={unreadCount}
                helpRequests={helpRequests}
                onAddHelpRequest={handleAddHelpRequest}
                onAcceptHelpRequest={handleAcceptHelpRequest}
                workshops={workshops}
                onToggleJoinWorkshop={handleToggleJoinWorkshop}
                onAddWorkshop={handleAddWorkshop}
                activeTab={currentTab}
                onTabChange={setCurrentTab}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                userName={userName}
                setUserName={handleUpdateUserName}
                neighbourhood={neighbourhood}
                setNeighbourhood={setNeighbourhood}
                credits={credits}
                familyGroup={familyGroup}
                badges={badges}
                transactions={transactions}
                onOpenNotifications={() => setShowNotificationsModal(true)}
                onLogout={() => {
                  setCurrentScreen('welcome');
                  showToast(t('common.loggedOut'));
                }}
                activeTab={currentTab}
                onTabChange={setCurrentTab}
                onOpenLangModal={() => setShowLangModal(true)}
                currentLang={currentLang}
                feedSharingOptIn={feedSharingOptIn}
                onToggleFeedSharing={handleToggleFeedSharing}
                onOpenGoodDeeds={() => setShowGoodDeedsModal(true)}
              />
            )}

            {currentTab === 'home' && (
              <HomeScreen
                userName={userName}
                neighbourhood={neighbourhood}
                credits={credits}
                familyGroup={familyGroup}
                urgentRequests={helpRequests.slice(0, 2)}
                onOpenNotifications={() => setShowNotificationsModal(true)}
                unreadCount={unreadCount}
                onOpenNeighbourhoodModal={() => setShowNeighbourhoodModal(true)}
                onTabChange={setCurrentTab}
                onSelectHelpRequest={() => {}}
                deeds={goodDeeds}
                celebratedDeedIds={celebratedDeedIds}
                commentsCountMap={commentsCountMap}
                onOpenGoodDeeds={() => setShowGoodDeedsModal(true)}
                onHideDeed={handleHideDeed}
                onCelebrateDeed={handleCelebrateDeed}
                onOpenComments={(deed) => setActiveCommentsDeed(deed)}
                activeQuest={communityQuests.find((q) => q.id === 'quest-walk-weekly') || communityQuests[0]}
                groups={communityGroups}
                selectedInterests={selectedInterests}
                onOpenAllGroups={() => setShowAllGroupsModal(true)}
                onOpenGroupDetails={(g) => setSelectedGroupDetails(g)}
                onToggleJoinGroup={handleToggleJoinGroup}
              />
            )}

            {currentTab === 'quests' && (
              <QuestsScreen
                userName={userName}
                neighbourhood={neighbourhood}
                communityQuests={communityQuests}
                onLogContribution={handleLogQuestContribution}
                onToggleJoinQuest={handleToggleJoinQuest}
                onOpenNeighbourhoodModal={() => setShowNeighbourhoodModal(true)}
                onOpenNotifications={() => setShowNotificationsModal(true)}
                unreadCount={unreadCount}
                activeTab={currentTab}
                onTabChange={setCurrentTab}
                onShowToast={showToast}
                onOpenGoodDeeds={() => setShowGoodDeedsModal(true)}
                recentMilestone={recentMilestone}
                onClearRecentMilestone={() => setRecentMilestone(null)}
              />
            )}
          </>
        )}

        {/* Screen 10: Community Groups Dedicated Screen (via Screen Switcher) */}
        {currentScreen === 'community_groups' && (
          <CommunityGroupsModal
            groups={communityGroups}
            neighbourhood={neighbourhood}
            selectedInterests={selectedInterests}
            currentUserName={userName}
            onOpenGroupDetails={(g) => setSelectedGroupDetails(g)}
            onToggleJoin={handleToggleJoinGroup}
            onCreateGroup={handleCreateCommunityGroup}
            onClose={() => {
              setCurrentScreen('main_app');
              setCurrentTab('home');
            }}
          />
        )}
      </div>

      {/* Global Modals */}
      {showLangModal && (
        <LanguageModal
          currentLang={currentLang}
          onSelectLang={handleSelectLang}
          onClose={() => setShowLangModal(false)}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onSelectNotification={handleSelectNotification}
          onClose={() => setShowNotificationsModal(false)}
        />
      )}

      {showNeighbourhoodModal && (
        <NeighbourhoodModal
          currentNeighbourhood={neighbourhood}
          onSelectNeighbourhood={(name) => {
            setNeighbourhood(name);
            showToast(t('common.switchedCommunity', { name }));
          }}
          onClose={() => setShowNeighbourhoodModal(false)}
        />
      )}

      {showGoodDeedsModal && (
        <GoodDeedsModal
          deeds={goodDeeds}
          celebratedDeedIds={celebratedDeedIds}
          commentsCountMap={commentsCountMap}
          feedSharingOptIn={feedSharingOptIn}
          onToggleFeedSharing={handleToggleFeedSharing}
          onHideDeed={handleHideDeed}
          onRestoreDeed={handleRestoreDeed}
          onCelebrateDeed={handleCelebrateDeed}
          onOpenComments={(deed) => setActiveCommentsDeed(deed)}
          onSimulateDeed={handleSimulateDeed}
          onClose={() => setShowGoodDeedsModal(false)}
          currentUserName={userName}
        />
      )}

      {/* Deed Comments Sheet Modal */}
      {activeCommentsDeed && (
        <DeedCommentsSheet
          deed={activeCommentsDeed}
          comments={deedComments}
          currentUserId={`user-${userName.toLowerCase().replace(/\s+/g, '-')}`}
          currentUserName={userName}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onReportComment={handleReportComment}
          onClose={() => setActiveCommentsDeed(null)}
        />
      )}

      {/* Community Groups Full Modal (via See All or Groups action) */}
      {showAllGroupsModal && (
        <CommunityGroupsModal
          groups={communityGroups}
          neighbourhood={neighbourhood}
          selectedInterests={selectedInterests}
          currentUserName={userName}
          onOpenGroupDetails={(g) => setSelectedGroupDetails(g)}
          onToggleJoin={handleToggleJoinGroup}
          onCreateGroup={handleCreateCommunityGroup}
          onClose={() => setShowAllGroupsModal(false)}
        />
      )}

      {/* Group Details Modal */}
      {selectedGroupDetails && (
        <GroupDetailsModal
          group={selectedGroupDetails}
          currentUserName={userName}
          onToggleJoin={handleToggleJoinGroup}
          onPostMessage={handlePostGroupDiscussion}
          onRsvpActivity={handleRsvpGroupActivity}
          onClose={() => setSelectedGroupDetails(null)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 z-80 px-4 py-2.5 bg-[#775537] text-white text-xs font-bold rounded-full shadow-lg border border-[#FBE29D]/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <span className="material-symbols-outlined text-[16px] text-[#FBE29D]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
