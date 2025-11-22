import { useState } from 'react'; // Added useMemo for filteredReports
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  HomeIcon,
  FileTextIcon,
  ShieldUserIcon,
  FilePenIcon,
  UsersIcon,
} from 'lucide-react';

import AuthNavbar from '@/components/utils/AuthNavbar';
import Meta from '@/components/utils/metadata';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardTab } from '@/components/admin/dashboard';
import { ReportsTab } from '@/components/admin/reports';
import { UserManagementTab } from '@/components/admin/user';
import { AuditLogsTab } from '@/components/admin/audit';
import { RestrictionsTab } from '@/components/admin/restriction';


const AdminModerationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: HomeIcon,
      cyname: "admin-dashboard-button"
    },
    {
      title: "Reports",
      url: "reports",
      icon: FilePenIcon,
      cyname: "admin-reports-button"
    },
    {
      title: "Restrictions",
      url: "restrictions",
      icon: ShieldUserIcon,
      cyname: "admin-restrictions-button"
    },
    {
      title: "User Management",
      url: "user-management",
      icon: UsersIcon,
      cyname: "admin-user-management-button"
    },
    {
      title: "Audit Logs",
      url: "audit-logs",
      icon: FileTextIcon,
      cyname: "admin-audit-logs-button"
    }
  ]
 
  const AppSidebar = () => {
    return (
      <Sidebar variant={"floating"}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton data-cy={item.cyname} onClick={()=>{ setActiveTab(item.url) }}>
                        <item.icon />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }
  return (
    <>
      <Meta
        title="Admin Dashboard | Only Geeks"
        description="Manage reports, user restrictions, and monitor platform activity on Only Geeks."
        keywords="admin, dashboard, reports, restrictions, user management, audit logs, only geeks"
        image=""
        url={window.location.href}
      />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main>
            <AuthNavbar />
            <div className="h-[1px] w-full my-2" />
            <div className='px-4'>
              {activeTab === "dashboard" && <DashboardTab navigator={setActiveTab} />}
              {activeTab === "reports" && <ReportsTab />}
              {activeTab === "restrictions" && <RestrictionsTab />}
              {activeTab === "user-management" && <UserManagementTab />}
              {activeTab === "audit-logs" && <AuditLogsTab />}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default AdminModerationDashboard;