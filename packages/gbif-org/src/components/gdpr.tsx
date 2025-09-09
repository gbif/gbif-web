import { useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
export const GDPR = () => {
  const { user, updateProfile, logout } = useUser();
  const { toast } = useToast();
  const toastRef = useRef({ id: '', dismiss: () => {} });

  useEffect(() => {
    if (
      user?.userName &&
      (user?.settings?.has_read_gdpr_terms === 'false' || !user?.settings?.has_read_gdpr_terms)
    ) {
      handleGDPRConsent();
    }
  }, [user?.userName, user?.settings?.has_read_gdpr_terms]);

  const saveUserSettings = async () => {
    await updateProfile({
      ...user,
      settings: { ...(user?.settings || {}), has_read_gdpr_terms: 'true' },
    });
    toastRef.current?.dismiss();
    console.log('User settings saved');
  };

  const signOut = async () => {
    await logout();
    toastRef.current?.dismiss();
  };

  const handleGDPRConsent = () => {
    const handle = toast({
      description: (
        <>
          <div className="g-text-sm g-text-gray-500 g-space-y-2">
            <h1>GDPR & Privacy Policy</h1>
            <p>
              As the{' '}
              <a
                className="g-text-blue-500 hover:g-text-blue-700"
                href="http://data.europa.eu/eli/reg/2016/679/oj"
                target="_blank"
              >
                European General Data Protection Regulation
              </a>
              , or GDPR, came into force on 25 May 2018, GBIF remains committed to openness and
              transparency.
            </p>
            <p>
              Registered users' login credentials enable them to access their accounts. They also
              enable us to support and contact them about important changes. GBIF does not barter or
              sell personal information or give it to advertisers.
            </p>
            <p>
              Our{' '}
              <a ng-href="/terms/privacy-policy" target="_blank">
                privacy policy
              </a>
              , which provides detailed information about how and where we use personal information,
              was prepared to align with the draft version of the GDPR. As we update our processes
              to comply with GDPR commitments, we have updated the policy to include:
            </p>
            <ul className="g-list-disc g-pl-5">
              <li>the use of ORCID-based login</li>
              <li>the use of Instagram for social media</li>
              <li>the use of MailChimp for opt-in email</li>
            </ul>
          </div>
          <div className="g-flex g-mt-3">
            <Button variant="link" onClick={signOut}>
              Log out
            </Button>
            <div className="g-flex-auto"></div>
            <Button
              size="sm"
              onClick={() => {
                // Save consent to user profile
                // This will prevent the banner from showing again
                // In a real application, you would also want to save this to the server
                // For this example, we just log it to the console
                saveUserSettings();
                console.log('User has accepted GDPR terms');
              }}
            >
              Understood, and don't show me this again
            </Button>
          </div>
        </>
      ),
      variant: 'default',
      duration: 100000,
      className: 'g-bg-white',
    });
    toastRef.current = handle;
  };

  return <></>;
};
