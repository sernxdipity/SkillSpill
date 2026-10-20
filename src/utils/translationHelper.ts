import { TFunction } from 'i18next';
import { HelpRequest, Workshop, Quest, Badge, Transaction, AppNotification, GoodDeed } from '../types';
import { InterestOption } from '../data/initialData';

export const getTranslatedHelpRequest = (t: TFunction, req: HelpRequest): HelpRequest => {
  const titleKey = `demoData.helpRequests.${req.id}.title`;
  const descKey = `demoData.helpRequests.${req.id}.description`;
  const timeKey = `demoData.helpRequests.${req.id}.timeStr`;
  const catKey = `categories.${req.category}`;

  return {
    ...req,
    title: t(titleKey, { defaultValue: req.title }),
    description: t(descKey, { defaultValue: req.description }),
    timeStr: t(timeKey, { defaultValue: req.timeStr }),
    category: t(catKey, { defaultValue: req.category }),
  };
};

export const getTranslatedWorkshop = (t: TFunction, ws: Workshop): Workshop => {
  const titleKey = `demoData.workshops.${ws.id}.title`;
  const descKey = `demoData.workshops.${ws.id}.description`;
  const timeKey = `demoData.workshops.${ws.id}.timeStr`;
  const catKey = `categories.${ws.category}`;

  let statusTranslated = ws.status;
  if (ws.status === 'Confirmed') {
    statusTranslated = t('common.confirmed', { defaultValue: ws.status });
  } else if (ws.status === 'Waiting for Participants') {
    statusTranslated = t('common.waitingParticipants', { defaultValue: ws.status });
  }

  return {
    ...ws,
    title: t(titleKey, { defaultValue: ws.title }),
    description: t(descKey, { defaultValue: ws.description }),
    timeStr: t(timeKey, { defaultValue: ws.timeStr }),
    category: t(catKey, { defaultValue: ws.category }),
    status: statusTranslated,
  };
};

export const getTranslatedQuest = (t: TFunction, q: Quest): Quest => {
  const titleKey = `demoData.quests.${q.id}.title`;
  const descKey = `demoData.quests.${q.id}.description`;

  return {
    ...q,
    title: t(titleKey, { defaultValue: q.title }),
    description: t(descKey, { defaultValue: q.description }),
  };
};

export const getTranslatedBadge = (t: TFunction, b: Badge): Badge => {
  const titleKey = `demoData.badges.${b.id}.title`;
  const descKey = `demoData.badges.${b.id}.description`;

  return {
    ...b,
    title: t(titleKey, { defaultValue: b.title }),
    description: t(descKey, { defaultValue: b.description }),
  };
};

export const getTranslatedNotification = (t: TFunction, n: AppNotification): AppNotification => {
  const titleKey = `demoData.notifications.${n.id}.title`;
  const msgKey = `demoData.notifications.${n.id}.message`;
  const timeKey = `demoData.notifications.${n.id}.time`;

  return {
    ...n,
    title: t(titleKey, { defaultValue: n.title }),
    message: t(msgKey, { defaultValue: n.message }),
    time: t(timeKey, { defaultValue: n.time }),
  };
};

export const getTranslatedTransaction = (t: TFunction, tx: Transaction): Transaction => {
  const titleKey = `demoData.transactions.${tx.id}.title`;
  const dateKey = `demoData.transactions.${tx.id}.date`;

  return {
    ...tx,
    title: t(titleKey, { defaultValue: tx.title }),
    date: t(dateKey, { defaultValue: tx.date }),
  };
};

export const getTranslatedInterest = (t: TFunction, item: InterestOption): InterestOption => {
  const titleKey = `interests.${item.id}.title`;
  const subtitleKey = `interests.${item.id}.subtitle`;

  return {
    ...item,
    title: t(titleKey, { defaultValue: item.title }),
    subtitle: t(subtitleKey, { defaultValue: item.subtitle }),
  };
};

export const getTranslatedGoodDeedTime = (t: TFunction, timeKey: string): string => {
  return t(`goodDeeds.time.${timeKey}`, { defaultValue: timeKey });
};

export const getTranslatedGoodDeedMessage = (t: TFunction, deed: GoodDeed): string => {
  const key = `goodDeeds.templates.${deed.templateKey}`;
  const translated = t(key, {
    actor: deed.actorName,
    recipient: deed.recipientName || t('goodDeeds.aNeighbour', { defaultValue: 'a neighbour' }),
    teacher: deed.recipientName || 'Aisha',
    helper: deed.actorName,
    activity: deed.activityTitle,
    group: deed.actorName,
    instructor: deed.recipientName || 'Aisha',
    defaultValue: '',
  });

  if (translated) return translated;

  // Fallback generation based on deed type
  switch (deed.type) {
    case 'help_completed':
      if (deed.recipientName) {
        return `${deed.recipientName} thanked ${deed.actorName} for helping with ${deed.activityTitle}.`;
      }
      return `${deed.actorName} helped a neighbour with ${deed.activityTitle}.`;
    case 'workshop_published':
      return `${deed.actorName} is hosting a ${deed.activityTitle}!`;
    case 'workshop_completed':
      return `${deed.actorName} completed a workshop on ${deed.activityTitle}.`;
    case 'group_quest_completed':
      return `${deed.actorName} completed the ${deed.activityTitle}!`;
    case 'volunteer_completed':
      return `${deed.actorName} completed a community volunteering activity: ${deed.activityTitle}.`;
    default:
      return `${deed.actorName} contributed a positive deed in the neighbourhood.`;
  }
};

