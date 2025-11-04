import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog'
import {
  GET_MY_EDUCATION_QUERY,
  GET_EDUCATION_BY_USERNAME_QUERY,
  DELETE_EDUCATION_MUTATION,
  type Education as EducationType,
} from '@/graphql/education'
import {
  GET_MY_ACHIEVEMENTS_QUERY,
  GET_ACHIEVEMENTS_BY_USERNAME_QUERY,
  DELETE_ACHIEVEMENT_MUTATION,
  type Achievement as AchievementType,
} from '@/graphql/achievement'
import { useMutation, useQuery } from '@apollo/client/react'
import { CREATE_EDUCATION_PATH, CREATE_ACHIEVEMENT_PATH } from '@/constants/routes'

const EducationCard = ({ myUsername, viewUsername }: { myUsername?: string; viewUsername?: string }) => {
  const isMyProfile = myUsername === viewUsername
  const [educations, setEducations] = useState<EducationType[]>([])
  const { data, error } = useQuery<{ getMyEducations?: EducationType[]; getEducationsByUsername?: EducationType[] }>(
    isMyProfile ? GET_MY_EDUCATION_QUERY : GET_EDUCATION_BY_USERNAME_QUERY,
    {
      variables: { username: viewUsername },
      skip: !viewUsername || !myUsername,
    },
  )

  useEffect(() => {
    if (!error && data) {
      if (isMyProfile) setEducations(data.getMyEducations || [])
      else setEducations(data.getEducationsByUsername || [])
    }
  }, [data, error, isMyProfile])

  const [deleteEducationById, { loading: deleting }] = useMutation(DELETE_EDUCATION_MUTATION, {
    refetchQueries: [{ query: GET_MY_EDUCATION_QUERY }],
  })

  const [promptDeleteId, setPromptDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  const formatRange = (s?: string | null, e?: string | null) => {
    if (!s && !e) return ''
    const start = s ? new Date(s).toLocaleDateString('en-GB') : ''
    const end = e ? new Date(e).toLocaleDateString('en-GB') : ''
    return `${start}${start && end ? ' - ' : ''}${end}`
  }

  // Placeholder when no items and viewing own profile
  if (educations.length === 0 && isMyProfile) {
    return (
      <Card className="mb-6 rounded-xl">
        <CardContent className="p-6 pb-0 pt-0">
          <CardTitle className="mb-6 text-2xl font-bold leading-snug">Education</CardTitle>
          <div className="flex flex-col justify-items-start">
            <div>
              <div className="text-muted-foreground">
                <h3 className="text-lg font-semibold">School</h3>
                <p className="text-sm">Degree, Field of Study</p>
                <p className="text-sm text-muted-foreground">startDate - endDate</p>
              </div>
              <Link to={CREATE_EDUCATION_PATH}>
                <Button
                  variant="outline"
                  size="sm"
                  data-cy="add-education-button"
                  className="mt-4 rounded-lg border-gray-300 hover:bg-gray-100"
                >
                  <span className="mr-2 text-xl">+</span> Add education
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 rounded-xl">
      <Dialog open={!!promptDeleteId} onOpenChange={() => setPromptDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-lg font-medium text-gray-900">Are you sure you want to delete this education?</h2>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!promptDeleteId) return
                deleteEducationById({ variables: { deleteEducationId: promptDeleteId } })
                setPromptDeleteId(null)
              }}
              disabled={deleting}
              data-cy="confirm-delete-education-button"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardContent className="p-6 pb-0 pt-0">
        <CardTitle className="mb-6">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold leading-snug">Education</h1>
            {isMyProfile && (
              <Link to={CREATE_EDUCATION_PATH}>
                <Button className="ml-4 rounded-lg bg-gray-900 text-white shadow-md hover:bg-gray-700">
                  <span className="mr-2 text-xl">+</span> Add new
                </Button>
              </Link>
            )}
          </div>
        </CardTitle>
        <div className="flex flex-col justify-items-start">
          {educations.map((edu, idx) => (
            <div key={edu.id}>
              <h3 className="text-lg font-semibold">{edu.school}</h3>
              <p className="text-sm">
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatRange(edu.startDate as unknown as string, edu.endDate as unknown as string)}
              </p>
              <div className="mt-4 space-x-2">
                {isMyProfile && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate(`/create/education/?editId=${edu.id}`)}
                      data-cy="edit-education-button"
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant={'destructive'}
                      size="sm"
                      className="rounded-lg bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setPromptDeleteId(edu.id)}
                      data-cy="delete-education-button"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </div>
              {idx !== educations.length - 1 && <div className="my-4 border-b" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const AchievementsCard = ({ myUsername, viewUsername }: { myUsername?: string; viewUsername?: string }) => {
  const isMyProfile = myUsername === viewUsername
  const [achievements, setAchievements] = useState<AchievementType[]>([])
  const { data, error } = useQuery<{
    getMyAchievements?: AchievementType[]
    getAchievementsByUsername?: AchievementType[]
  }>(isMyProfile ? GET_MY_ACHIEVEMENTS_QUERY : GET_ACHIEVEMENTS_BY_USERNAME_QUERY, {
    variables: { username: viewUsername },
    skip: !viewUsername || !myUsername,
  })

  useEffect(() => {
    if (!error && data) {
      if (isMyProfile) setAchievements(data.getMyAchievements || [])
      else setAchievements(data.getAchievementsByUsername || [])
    }
  }, [data, error, isMyProfile])

  const [deleteAchievementById, { loading: deleting }] = useMutation(DELETE_ACHIEVEMENT_MUTATION, {
    refetchQueries: [{ query: GET_MY_ACHIEVEMENTS_QUERY }],
  })
  const [promptDeleteId, setPromptDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  if (achievements.length === 0 && isMyProfile) {
    return (
      <Card className="mb-6 rounded-xl">
        <CardContent className="p-6 pb-0 pt-0">
          <CardTitle className="mb-6 text-2xl font-bold leading-snug">Achievements</CardTitle>
          <div className="flex flex-col justify-items-start">
            <div>
              <div className="text-muted-foreground">
                <h3 className="text-lg font-semibold">Name</h3>
                <p className="text-sm">Issuer</p>
                <p className="text-sm text-muted-foreground">Issued Date</p>
                <p className="text-sm text-muted-foreground">Description</p>
              </div>
              <Link to={CREATE_ACHIEVEMENT_PATH}>
                <Button
                  variant="outline"
                  size="sm"
                  data-cy="add-achievement-button"
                  className="mt-4 rounded-lg border-gray-300"
                >
                  <span className="mr-2 text-xl">+</span> Add achievement
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 rounded-xl">
      <Dialog open={!!promptDeleteId} onOpenChange={() => setPromptDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-lg font-medium text-gray-900">Are you sure you want to delete this achievement?</h2>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!promptDeleteId) return
                deleteAchievementById({ variables: { deleteAchievementId: promptDeleteId } })
                setPromptDeleteId(null)
              }}
              disabled={deleting}
              data-cy="confirm-delete-achievement-button"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardContent className="p-6 pb-0 pt-0">
        <CardTitle className="mb-6">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold leading-snug">Achievements</h1>
            {isMyProfile && (
              <Link to={CREATE_ACHIEVEMENT_PATH}>
                <Button className="ml-4 rounded-lg shadow-md">
                  <span className="mr-2 text-xl">+</span> Add new
                </Button>
              </Link>
            )}
          </div>
        </CardTitle>
        <div className="flex flex-col justify-items-start">
          {achievements.map((a, idx) => (
            <div key={a.id}>
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-sm">{a.issuer}</p>
              <p className="text-sm text-muted-foreground">
                {a.date ? new Date(a.date).toLocaleDateString('en-GB') : ''}
              </p>
              {a.photos && a.photos.length > 0 && (
                <img
                  src={a.photos[0]}
                  alt={`${a.title} certificate`}
                  className="my-2 w-32 cursor-pointer rounded-md object-cover transition-transform hover:scale-105"
                  onClick={() => a.photos?.[0] && window.open(a.photos[0], '_blank')}
                />
              )}
              <p className="text-sm text-muted-foreground">{a.description}</p>
              <div className="mt-4 space-x-2">
                {isMyProfile && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate(`/create/achievement/?editid=${a.id}`)}
                      data-cy="edit-achievement-button"
                    >
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant={'destructive'}
                      size="sm"
                      className="rounded-lg bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setPromptDeleteId(a.id)}
                      data-cy="delete-achievement-button"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </div>
              {idx !== achievements.length - 1 && <div className="my-4 border-b" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const ProfilePortfolio = ({ myUsername, viewUsername }: { myUsername?: string; viewUsername?: string }) => {
  return (
    <div className="space-y-6 px-4 py-4 sm:px-8">
      <EducationCard myUsername={myUsername} viewUsername={viewUsername} />
      <AchievementsCard myUsername={myUsername} viewUsername={viewUsername} />
    </div>
  )
}

export default ProfilePortfolio
