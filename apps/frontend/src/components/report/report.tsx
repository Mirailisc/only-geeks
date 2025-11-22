import { AM_I_REPORT_THIS_QUERY, CREATE_REPORT_MUTATION, type Report, type ReportStructure, type ReportTargetType } from '@/graphql/report'
import { useMutation } from 'node_modules/@apollo/client/react/hooks/useMutation'
import { useState, useCallback, useEffect } from 'react' // Import useEffect
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BLOG_REPORT_REASON, DEFAULT_REPORT_REASON, PROJECT_REPORT_REASON, USER_REPORT_REASON } from '@/constants/report'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Profile } from '@/graphql/profile'
import { toast } from 'sonner'
import { TriangleAlertIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client/react'

interface ReportProps {
  type: ReportTargetType
  myUsername: string
  user: Partial<Profile>
  targetId: string
  cybuttonname?: string
}
const getType = (type: ReportTargetType) => {
  switch(type){
    case "BLOG":
      return "Blog";
    case "PROJECT":
      return "Project";
    case "USER":
      return "Profile";
    default:
      return "item";
  }
}
const ReportComponentWithButton = ({type, myUsername, user, targetId, cybuttonname}: ReportProps) => {
  const navigation = useNavigate()
  const defaultReportStructure: ReportStructure = {
    targetType: type,
    targetId: targetId,
    reason: '',
    category: null,
  }
  const REPORT_REASON = 
    // eslint-disable-next-line no-nested-ternary
    type === 'BLOG' ? BLOG_REPORT_REASON :
    // eslint-disable-next-line no-nested-ternary
    type === 'PROJECT' ? PROJECT_REPORT_REASON :
    type === 'USER' ? USER_REPORT_REASON :
    DEFAULT_REPORT_REASON
  
  const [reportStructure, setReportStructure] = useState<ReportStructure>(defaultReportStructure)
  // New state for the Textarea input value
  const [localReason, setLocalReason] = useState<string>(defaultReportStructure.reason) 
  
  const [createReport, { loading: loadingCreatingReport, error: creatingReportError }] = useMutation<{ createReport: Report }>(CREATE_REPORT_MUTATION)
  const [promptReport, setPromptReport] = useState<boolean>(false)
  const [promptLoginToReport, setPromptLoginToReport] = useState<boolean>(false)
  const [errorReport, setErrorReport] = useState<string | null>(null)
  const [amIReport, { loading: loadingFindingReport }] = useLazyQuery<{ hasReportedTarget: boolean }>(AM_I_REPORT_THIS_QUERY)
  
  // Custom Debounce effect for the reason Textarea
  useEffect(() => {
    // Set a timeout to update the main reportStructure after 500ms
    const handler = setTimeout(() => {
      setReportStructure(prev => ({
        ...prev,
        reason: localReason,
      }));
    }, 500); // Debounce delay of 500ms

    // Cleanup function to clear the timeout if localReason changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [localReason]); // Only re-run the effect if localReason changes

  const toggleReportModal = async () => {
    const { data } = await amIReport({
      variables: {
        targetId,
        targetType: type,
      },
    })

    if (!data) {
      toast.info('Checking report status, please wait...')
      return
    }

    if (data.hasReportedTarget) {
      toast.error('You have already reported this ' + getType(type).toLowerCase() + '.')
    } else {
      setPromptReport(!promptReport)
    }
  }

  // Handler for the Textarea onChange event
  const handleReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalReason(e.target.value);
  }, []); // Empty dependency array means this function is created once

  const submitReport = () => {
    setErrorReport(null);
    // Use the value from reportStructure (which is updated by the debounced effect)
    if(reportStructure.category == null){
      setErrorReport("Please select a reason for reporting this " + getType(type).toLowerCase() + ".");
      return; // Exit if no category is selected
    }
    
    // Check if the reason is still empty (even after debouncing)
    if(!reportStructure.reason.trim()){
        setErrorReport("Please provide a description for reporting this " + getType(type).toLowerCase() + ". (" + reportStructure.reason + ")");
        return;
    }

    createReport({
      variables: {
        input: reportStructure,
      },
      refetchQueries: [{ query: AM_I_REPORT_THIS_QUERY, variables: {
        targetId: targetId,
        targetType: type,
      } }],
      onCompleted: () => {
        setErrorReport(null)
        toast.success('Report submitted successfully.')
        setReportStructure(defaultReportStructure)
        setLocalReason(defaultReportStructure.reason) // Also reset local reason
        setPromptReport(false)
      },
      onError: (error) => {
        setErrorReport(error.message)
      }
    })

    if(creatingReportError){
      setErrorReport(creatingReportError.message);
    }
  }
  
  // Use a temporary function to safely reset states when closing the dialog
  const handleDialogClose = () => {
    setPromptReport(false)
    setReportStructure(defaultReportStructure)
    setLocalReason(defaultReportStructure.reason) // Reset local reason on close
    setErrorReport(null) // Clear any lingering errors
  }

  if(!user) return null;
  return (
    <>
      <Dialog open={promptReport} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report this {getType(type).toLowerCase()}</DialogTitle>
            <DialogDescription>
              Please provide a reason for reporting this {getType(type).toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          {errorReport && <Alert variant={"destructive"}>
            <TriangleAlertIcon />
            <div className="flex-1">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{errorReport}</AlertDescription>
            </div>
          </Alert>}
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="report-category">Reason</Label>
              <Select onValueChange={(value)=>{
                setReportStructure({
                  ...reportStructure,
                  category: value as ReportStructure['category'],
                })
              }}>
                <SelectTrigger data-cy="report-category-selector" id="report-category">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {
                    REPORT_REASON.map((reason)=>(
                      <SelectItem data-cy={`report-reason-${reason.value}`} key={`report-reason-${reason.value}`} value={reason.value}>{reason.label}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="report-reason-text">Tell me why?</Label>
              <Textarea 
                id="report-reason-text"
                data-cy="input-report-reason"
                value={localReason} // Bind to local state for immediate feedback
                onChange={handleReasonChange} // Use the debounced change handler
                placeholder={`I found this ${getType(type).toLowerCase()} offensive because...`} 
                rows={7} 
              />
            </div>
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loadingCreatingReport}>Cancel</Button>
            </DialogClose>
            <Button variant={"destructive"} data-cy="submit-report-button" onClick={submitReport} disabled={loadingCreatingReport}>
                {loadingCreatingReport ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Alert to make sure that user is login before going to report this blog */}
      <AlertDialog open={promptLoginToReport} onOpenChange={setPromptLoginToReport}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to report this {getType(type).toLowerCase()}. Please log in to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=> setPromptLoginToReport(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=> navigation(`/login?redirect=${window.location.pathname}`)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {
        myUsername !== user.username && (
          <Button variant="destructive" data-cy={cybuttonname ?? "report-button"} size="sm" className='w-max' disabled={loadingFindingReport} onClick={()=>{
            if(myUsername !== ""){
              toggleReportModal();                        
            }else{
              setPromptLoginToReport(true);
            }
          }}>
              <TriangleAlertIcon className='w-4 h-4 mr-2' /> Report {
                getType(type).replace(/^\w/, (c) => c.toUpperCase())
              }
          </Button>
        )
      }
    </>
  )
}

export default ReportComponentWithButton