import React from 'react';
import { View } from 'react-native';
import HeroSection from './HeroSection';
import LatestUpdatesSection from './LatestUpdatesSection';
import MembersSection from './MembersSection';
import PMKusumSection from './PMKusumSection';
import AchievementSection from './AchievementSection';
import InformationSection from './InformationSection';
import EventsSection from './EventsSection';
import SocialAndVideoSection from './SocialAndVideoSection';
import Spacer from '@/components/ui/Spacer';

// Top-level home page. Sections are intentionally separate components so the
// page reads like a table of contents — if a section is removed from this list,
// it stops shipping. No data fetching here; each section owns its own state.

function HomeScreen() {
  return (
    <View style={{ backgroundColor: 'white' }}>
      <HeroSection />
      <LatestUpdatesSection />
      <Spacer />
      <MembersSection />
      <Spacer />
      <PMKusumSection />
      <Spacer />
      <AchievementSection />
      <Spacer />
      <InformationSection />
      <SocialAndVideoSection />
      <EventsSection />
    </View>
  );
}

export default HomeScreen;
