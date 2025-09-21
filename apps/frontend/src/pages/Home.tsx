import Navbar from '@/components/Home/Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className='h-screen flex justify-center items-center'>
        <h1 className="text-3xl font-bold">Hello World!</h1>
      </div>
    </div>
  )
}
