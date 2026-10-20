"use client";

import React, { useState } from "react";
import { useCreator } from "@/context/CreatorContext";
import { calculateCompatibility } from "@/utils/compatibility";
import { Opportunity } from "@/types/creator";

// Modular Dashboard Components
import { DashboardTopHeader } from "@/components/dashboard/DashboardTopHeader";
import { CreatorSnapshotCard } from "@/components/dashboard/CreatorSnapshotCard";
import { CreatorIntelligenceCard } from "@/components/dashboard/CreatorIntelligenceCard";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { PersonalizedOpportunities } from "@/components/dashboard/PersonalizedOpportunities";
import { WhyTheseOpportunities } from "@/components/dashboard/WhyTheseOpportunities";
import { ApplicationPipeline } from "@/components/dashboard/ApplicationPipeline";
import { CreatorGoalsCard } from "@/components/dashboard/CreatorGoalsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EmptyDashboardState } from "@/components/dashboard/EmptyDashboardState";

// Opportunity Modals
import { OpportunityDetailsModal } from "@/components/opportunities/OpportunityDetailsModal";
import { ApplyModal } from "@/components/opportunities/ApplyModal";

export default function CreatorDashboardPage() {
  const { activeCreator, opportunities } = useCreator();

  // Modal interaction state
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  // If creator profile is empty, gracefully render onboarding prompt instead of fake data
  if (!activeCreator) {
    return <EmptyDashboardState />;
  }

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setDetailsOpen(true);
  };

  const handleApplyClick = () => {
    setDetailsOpen(false);
    setApplyOpen(true);
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* 1. TOP HEADER: Greeting with real name, subtitle, notifications, avatar & AI indicator */}
      <div className="animate-fade-up">
        <DashboardTopHeader creator={activeCreator} />
      </div>

      {/* 2. CREATOR SNAPSHOT: Large verified profile card with live stats & edit link */}
      <div className="animate-fade-up delay-75">
        <CreatorSnapshotCard creator={activeCreator} />
      </div>

      {/* 3. CREATOR INTELLIGENCE & AI INSIGHT OF THE DAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-up delay-150">
        <div className="lg:col-span-8">
          <CreatorIntelligenceCard creator={activeCreator} />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <AiInsightCard creator={activeCreator} />
        </div>
      </div>

      {/* 4. PERSONALIZED OPPORTUNITIES: Category filter tabs, cards & why they match */}
      <div className="space-y-5 animate-fade-up delay-225">
        <PersonalizedOpportunities
          creator={activeCreator}
          opportunities={opportunities}
          onSelectOpportunity={handleSelectOpportunity}
        />

        {/* 5. "WHY THESE OPPORTUNITIES?" AI EXPLANATION PANEL */}
        <WhyTheseOpportunities creator={activeCreator} />
      </div>

      {/* 6. APPLICATION PIPELINE: Visual stage tracking with real user application counts */}
      <div className="animate-fade-up delay-300">
        <ApplicationPipeline opportunities={opportunities} />
      </div>

      {/* 7. MONETIZATION GOALS & QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-up delay-375">
        <div className="lg:col-span-4">
          <CreatorGoalsCard creator={activeCreator} />
        </div>
        <div className="lg:col-span-8 flex flex-col justify-between">
          <QuickActions />
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedOpp && (
        <OpportunityDetailsModal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          opportunity={selectedOpp}
          compatibility={calculateCompatibility(selectedOpp, activeCreator)}
          onApplyClick={handleApplyClick}
        />
      )}

      {/* 1-Click Pitch Apply Modal */}
      {selectedOpp && (
        <ApplyModal
          isOpen={applyOpen}
          onClose={() => setApplyOpen(false)}
          opportunity={selectedOpp}
        />
      )}
    </div>
  );
}
