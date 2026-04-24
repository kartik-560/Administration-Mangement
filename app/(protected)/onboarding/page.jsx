/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Loader2 } from 'lucide-react';

// Import the specific form components
import StudentOnboardingForm from '@/features/onboarding/StudentOnboardingForm';
import FacultyOnboardingForm from '@/features/onboarding/FacultyOnboardingForm';

export default function OnboardingPage() {
  const currentUser = useSelector((state) => state.auth.user);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

 useEffect(() => {
    if (currentUser?.registrationStep === 'COMPLETED') {
      
      // --- ROLE-BASED ROUTING ---
      const roleName = currentUser?.role?.name?.toUpperCase();
      const roleId = Number(currentUser?.roleId);

      if (roleName === 'STUDENT' || roleId === 5) {
        router.push('/student/dashboard');
      } 
      else if (roleName === 'FACULTY' || roleId === 4) {
        router.push('/faculty/dashboard');
      } 
      else if (roleName === 'ADMIN' || roleId === 1) {
        router.push('/admin/dashboard');
      } 
      else {
        // Fallback just in case
        router.push('/dashboard'); 
      }
      
      return;
    }

    // If they made it here, they need to onboard
    setIsChecking(false);
  }, [currentUser, router]);

  // Show a loading state while the useEffect checks their status to prevent UI flickering
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  // Helper to dynamically render the correct form based on the user's Role ID or Role Name
  const renderForm = () => {
    // Note: Adjust the IDs (2 for Student, 3 for Faculty) to match your specific database role IDs
    const roleId = Number(currentUser?.roleId);
    const roleName = currentUser?.role?.name?.toUpperCase();

    if (roleName === 'STUDENT' || roleId === 5) {
      return <StudentOnboardingForm user={currentUser} />;
    } 
    
    if (roleName === 'FACULTY' || roleId === 4) {
      return <FacultyOnboardingForm user={currentUser} />;
    } 

    // Fallback if the role isn't recognized
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 text-center">
        <ShieldAlert className="text-4xl mb-3" />
        <h3 className="font-bold mb-1">Unknown Role Configuration</h3>
        <p className="text-xs opacity-80">
          Your account role is not recognized for onboarding. Please contact your Administrator.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-8 px-4 overflow-hidden animate-in fade-in duration-700 bg-background">
      <div className="w-full max-w-[600px]">
        
        {/* --- Header --- */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black font-headline text-foreground tracking-tight mb-2">
            Welcome, {currentUser?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Let&apos;s finish setting up your account before you access the portal.
          </p>
        </header>

        {/* --- Dynamic Form Container --- */}
        <div className="bg-surface rounded-[1.5rem] shadow-xl border border-border/50 overflow-hidden">
          <div className="p-7 md:p-8">
            {renderForm()}
          </div>
        </div>

      </div>
    </div>
  );
}