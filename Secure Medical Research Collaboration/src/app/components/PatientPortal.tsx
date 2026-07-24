import { useState } from 'react';
import { Shield, FileText, Settings, CheckCircle, XCircle, Clock, Database } from 'lucide-react';
import { mockPatient, mockStudies } from '../mockData';

export function PatientPortal() {
  const [consentedProjects, setConsentedProjects] = useState(mockPatient.consentedProjects);

  const toggleConsent = (projectId: string) => {
    setConsentedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const activeProjects = mockStudies.filter(s => consentedProjects.includes(s.id));

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Patient Consent Portal</h1>
              <p className="mt-1.5 text-sm text-zinc-500">Manage your genomic data and research participation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-zinc-100 rounded-md border border-zinc-200">
                <p className="text-xs text-zinc-700 font-medium tracking-wide">ID: <span className="font-mono">{mockPatient.anonymizedId}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm font-medium">My Data Types</p>
                <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">{mockPatient.dataTypes.length}</p>
              </div>
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Database className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm font-medium">Active Consents</p>
                <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">{consentedProjects.length}</p>
              </div>
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <CheckCircle className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm font-medium">Data Access Events</p>
                <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">{mockPatient.dataAccessLog.length}</p>
              </div>
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Clock className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
          </div>
        </div>

        {/* My Data */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <Shield className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">My Genomic Data</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockPatient.dataTypes.map((dataType) => (
              <div
                key={dataType}
                className="px-4 py-3 bg-zinc-50 rounded-md border border-zinc-200 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-zinc-900">{dataType}</span>
                <CheckCircle className="w-4 h-4 text-zinc-400" />
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-zinc-100 rounded-md border border-zinc-200">
            <p className="text-sm text-zinc-700 leading-relaxed">
              <span className="font-semibold text-zinc-900">Privacy Protection:</span> Your raw data never leaves the secure hospital database.
              Only privacy-preserving aggregated insights are shared with researchers.
            </p>
          </div>
        </div>

        {/* Research Projects Using My Data */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <FileText className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Research Projects Using My Data</h2>
          </div>
          {activeProjects.length === 0 ? (
            <p className="text-zinc-500 text-sm">You have not consented to any research projects yet.</p>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 border border-zinc-200 rounded-md hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-6">
                      <h3 className="font-semibold text-zinc-900 mb-1.5">{project.title}</h3>
                      <p className="text-sm text-zinc-600 mb-3 leading-relaxed">{project.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-zinc-500">
                          <span className="font-medium text-zinc-700">Researcher:</span> {project.researcher}
                        </span>
                        <span className="text-zinc-500">
                          <span className="font-medium text-zinc-700">Institution:</span> {project.institution}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConsent(project.id)}
                      className="shrink-0 px-4 py-2 bg-white text-zinc-900 border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium shadow-sm"
                    >
                      Revoke Access
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
                    {project.dataRequirements
                      .filter(req => mockPatient.dataTypes.includes(req))
                      .map(dataType => (
                        <span
                          key={dataType}
                          className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200"
                        >
                          {dataType}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Research Projects */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <Settings className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Available Research Projects</h2>
          </div>
          <div className="space-y-4">
            {mockStudies
              .filter(s => !consentedProjects.includes(s.id) && s.status !== 'completed')
              .map((project) => (
                <div
                  key={project.id}
                  className="p-5 border border-zinc-200 rounded-md hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-6">
                      <h3 className="font-semibold text-zinc-900 mb-1.5">{project.title}</h3>
                      <p className="text-sm text-zinc-600 mb-3 leading-relaxed">{project.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-zinc-500">
                          <span className="font-medium text-zinc-700">Researcher:</span> {project.researcher}
                        </span>
                        <span className="text-zinc-500">
                          <span className="font-medium text-zinc-700">Privacy:</span> {project.privacyLevel}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConsent(project.id)}
                      className="shrink-0 px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium shadow-sm"
                    >
                      Give Consent
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
                    {project.dataRequirements
                      .filter(req => mockPatient.dataTypes.includes(req))
                      .map(dataType => (
                        <span
                          key={dataType}
                          className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200"
                        >
                          {dataType}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Data Access Log */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <Clock className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">My Data Access Log</h2>
          </div>
          <div className="space-y-3">
            {mockPatient.dataAccessLog.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-zinc-200 rounded-md bg-zinc-50/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{event.studyName}</h3>
                    <p className="text-sm text-zinc-600 mt-0.5">{event.purpose}</p>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{event.accessDate}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.dataUsed.map((dataType) => (
                    <span
                      key={dataType}
                      className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-600 rounded-md text-xs font-medium"
                    >
                      {dataType}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
