import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FormSuccess } from '@/components/formSuccess';
import { useConfig } from '@/config/config';
import { useUser } from '@/contexts/UserContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { z } from 'zod';
import {
  OptionalStringSchema,
  RequiredStringSchema,
} from '@/routes/resource/key/composition/blocks/customComponents/_shared';

const PUBLICATION_TYPES = [
  'JOURNAL_ARTICLE',
  'BOOK',
  'BOOK_CHAPTER',
  'CONFERENCE_PAPER_PROCEEDINGS',
  'PREPRINT_WORKING_PAPER',
  'REPORT',
  'WEB_PAGE',
  'THESIS_DISSERTATION',
  'COURSE_TEACHING_MATERIALS',
  'MAGAZINE_ARTICLE',
  'STATUTE',
  'PATENT',
  'NEWSPAPER_ARTICLE',
  'SOFTWARE_COMPUTER_PROGRAM',
  'HEARING',
  'TELEVISION_BROADCAST',
  'ENCYCLOPEDIA_ARTICLE',
  'CASE',
  'FILM',
  'BILL',
  'OTHER',
] as const;

const UsageReportSchema = z.object({
  title: RequiredStringSchema,
  type: z.enum(PUBLICATION_TYPES),
  authors: RequiredStringSchema,
  link: z.string().url().optional().or(z.literal('')),
  date: RequiredStringSchema,
  comments: OptionalStringSchema,
});

type UsageReportInputs = z.infer<typeof UsageReportSchema>;

type Props = {
  downloadKey: string;
  doi?: string | null;
};

export function UsageReportModal({ downloadKey, doi }: Props) {
  const [state, setState] = useState<'enter' | 'success'>('enter');
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn } = useUser();
  const { toast } = useToast();
  const config = useConfig();
  const { formatMessage } = useIntl();

  const form = useForm<UsageReportInputs>({
    resolver: zodResolver(UsageReportSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      type: undefined,
      authors: '',
      link: '',
      date: '',
      comments: '',
    },
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit((data: UsageReportInputs) => {
        fetch(`${config.formsEndpoint}/download-usage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.graphqlToken}`,
          },
          body: JSON.stringify({
            downloadKey,
            doi,
            ...data,
          }),
        })
          .then(async (response) => {
            if (!response.ok) throw response;
            form.reset();
            setState('success');
          })
          .catch((error) => {
            console.error(error);
            toast({
              title: formatMessage({ id: 'downloadUsage.form.saveFailure' }),
              variant: 'destructive',
            });
          });
      }),
    [form, toast, formatMessage, config.formsEndpoint, user?.graphqlToken, downloadKey, doi]
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setState('enter');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="g-ms-1">
          <FormattedMessage id="downloadKey.tellUs" />
        </Button>
      </DialogTrigger>
      <DialogContent className="g-max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="downloadUsage.title" />
          </DialogTitle>
        </DialogHeader>

        {state === 'enter' && (
          <Form {...form}>
            <form onSubmit={onSubmit} className="g-flex g-flex-col g-gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="downloadUsage.form.title" />
                      <span className="g-text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={formatMessage({ id: 'downloadUsage.form.titlePlaceholder' })}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="downloadUsage.form.type" />
                      <span className="g-text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={formatMessage({ id: 'downloadUsage.form.type' })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PUBLICATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <FormattedMessage id={`downloadUsage.types.${type}`} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="downloadUsage.form.authors" />
                      <span className="g-text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={formatMessage({ id: 'downloadUsage.form.authorsPlaceholder' })}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="downloadUsage.form.link" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={formatMessage({ id: 'downloadUsage.form.linkPlaceholder' })}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="downloadUsage.form.date" />
                      <span className="g-text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="downloadUsage.form.comments" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={formatMessage({
                          id: 'downloadUsage.form.commentsPlaceholder',
                        })}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="g-flex g-justify-end">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  <FormattedMessage id="downloadUsage.form.submit" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {state === 'success' && (
          <FormSuccess
            className="g-bg-inherit g-shadow-none"
            title={<FormattedMessage id="downloadUsage.form.saveSuccess" />}
            message={<FormattedMessage id="downloadUsage.form.saveSuccess" />}
            resetMessage={<FormattedMessage id="phrases.close" />}
            onReset={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
