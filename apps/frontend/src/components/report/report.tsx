import { AM_I_REPORT_THIS_QUERY, CREATE_REPORT_MUTATION, type Report, type ReportStructure, type ReportTargetType } from '@/graphql/report'
import { useMutation } from 'node_modules/@apollo/client/react/hooks/useMutation'
import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { BLOG_REPORT_REASON, DEFAULT_REPORT_REASON, PROJECT_REPORT_REASON, USER_REPORT_REASON } from '@/constants/report'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import type { Profile } from '@/graphql/profile'
import { toast } from 'sonner'
import { TriangleAlertIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client/react'
interface ReportProps {
  type: ReportTargetType
  myUsername: string
  user: Partial<Profile>
  targetId: string
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
const ReportComponentWithButton = ({type, myUsername, user, targetId}: ReportProps) => {
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
  const [createReport, { loading: loadingCreatingReport, error: creatingReportError }] = useMutation<{ createReport: Report }>(CREATE_REPORT_MUTATION)
  const [promptReport, setPromptReport] = useState<boolean>(false)
  const [promptLoginToReport, setPromptLoginToReport] = useState<boolean>(false)
  const [errorReport, setErrorReport] = useState<string | null>(null)
  const [amIReport, { loading: loadingFindingReport }] = useLazyQuery<{ hasReportedTarget: boolean }>(AM_I_REPORT_THIS_QUERY)
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
  const submitReport = () => {
    setErrorReport(null);
    // console.log("Report Structure:", reportStructure);
    if(reportStructure.category == null){
      setErrorReport("Please select a reason for reporting this " + getType(type).toLowerCase() + ".");
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
  if(!user) return null;
  return (
    <>
      <Dialog open={promptReport} onOpenChange={()=>{
        setPromptReport(false)
        setReportStructure(defaultReportStructure)
      }}>
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
              <Label htmlFor="name-1">Reason</Label>
              <Select onValueChange={(value)=>{
                setReportStructure({
                  ...reportStructure,
                  category: value as ReportStructure['category'],
                })
              }}>
                <SelectTrigger>
                  {
                    reportStructure.category ? REPORT_REASON.find((reason)=>reason.value === reportStructure.category)?.label || "Select reason" : "Select reason"
                  }
                </SelectTrigger>
                <SelectContent>
                  {
                    REPORT_REASON.map((reason)=>(
                      <SelectItem key={`blog-report-${reason.value}`} value={reason.value}>{reason.label}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Tell me why?</Label>
              <Textarea placeholder={`I found this ${getType(type).toLowerCase()} offensive because...`} rows={7} />
            </div>
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loadingCreatingReport}>Cancel</Button>
            </DialogClose>
            <Button variant={"destructive"} onClick={()=>{
              submitReport();
            }} disabled={loadingCreatingReport}>Submit</Button>
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
          <Button variant="destructive" size="sm" className='w-max' disabled={loadingFindingReport} onClick={()=>{
            if(myUsername !== ""){
              toggleReportModal();                        
            }else{
              setPromptLoginToReport(true);
            }
          }}>
              <TriangleAlertIcon /> Report {
                getType(type).replace(/^\w/, (c) => c.toUpperCase())
              }
          </Button>
        )
      }
    </>
  )
}

export default ReportComponentWithButton