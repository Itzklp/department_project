import React, { useState, useEffect } from 'react';
import { Download, ShieldAlert, CheckCircle, XCircle, UserPlus, Key } from 'lucide-react';
import config from '../../config';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- 1. UPDATED IMPORT

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${config.API_BASE_URL}/api/v1/logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setLogs(result.data);
            else toast.error(result.message);
        } catch (err) {
            toast.error("Failed to fetch system logs.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("CISIS Department - System Security Logs", 14, 22);
        
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        const tableColumn = ["Date & Time", "Action", "Email", "IP Address", "Details"];
        const tableRows = logs.map(log => [
            new Date(log.timestamp).toLocaleString(),
            log.action,
            log.email,
            log.ipAddress || 'N/A',
            log.details
        ]);

        // <-- 2. UPDATED USAGE (Pass 'doc' as the first parameter)
        autoTable(doc, {
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [30, 64, 175] },
            styles: { fontSize: 8, cellPadding: 2 }
        });

        doc.save("CISIS_Security_Logs.pdf");
        toast.success("PDF Downloaded successfully!");
    };

    const getBadgeConfig = (action) => {
        switch (action) {
            case 'LOGIN_SUCCESS': return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'SSO_LOGIN': return { color: 'bg-blue-100 text-blue-800', icon: ShieldAlert };
            case 'LOGIN_FAILED': return { color: 'bg-red-100 text-red-800', icon: XCircle };
            case 'REGISTER': return { color: 'bg-purple-100 text-purple-800', icon: UserPlus };
            case 'PASSWORD_RESET': return { color: 'bg-yellow-100 text-yellow-800', icon: Key };
            default: return { color: 'bg-gray-100 text-gray-800', icon: ShieldAlert };
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
                    <p className="text-gray-500 mt-1">Monitor authentication and registration events.</p>
                </div>
                <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg shadow transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Export PDF
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => {
                                    const Badge = getBadgeConfig(log.action);
                                    const Icon = Badge.icon;
                                    return (
                                        <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${Badge.color}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {log.action.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {log.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                                {log.details}
                                                <div className="text-xs text-gray-400 mt-0.5">IP: {log.ipAddress || 'N/A'}</div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemLogs;