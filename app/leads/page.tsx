'use client';

import React from 'react';
import Dashboard from '@/app/page';

export default function LeadsPage() {
  return (
    <div id="leads-tab-redirect">
      <Dashboard />
      <script dangerouslySetInnerHTML={{
        __html: `
          // Fallback to select Leads tab in UI on mount if rendered in DOM
          setTimeout(() => {
            const tabLeads = document.getElementById('tab-leads');
            if (tabLeads) tabLeads.click();
          }, 50);
        `
      }} />
    </div>
  );
}
