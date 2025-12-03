import UploadForm from './components/UploadForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-3xl font-bold text-black mb-8">CEC File Upload</h1>
      <UploadForm />
    </main>
  );
}