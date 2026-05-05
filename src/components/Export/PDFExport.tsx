import React, { useRef } from 'react';
import { Download, FileText, Settings } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

interface TableRow {
  name: string;
  category: string;
  value: number;
  status: 'active' | 'pending' | 'inactive';
}

interface PDFExportProps {
  data3D: Point3D[];
  data2D: Point2D[];
  tableData: TableRow[];
}

export const PDFExport: React.FC<PDFExportProps> = ({ data3D, data2D, tableData }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      // Capture de l'aperçu du rapport
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Ajouter des métadonnées
      pdf.setProperties({
        title: 'Rapport de Visualisation de Données',
        subject: 'Analyse des données multicouches',
        author: 'LayerSight',
        creator: 'Application LayerSight'
      });

      pdf.save('rapport-dataviz.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Export PDF</h3>
          <button
            onClick={generatePDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </button>
        </div>

        {/* Aperçu du rapport */}
        <div ref={reportRef} className="bg-white p-8 border border-gray-200 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Rapport de Visualisation de Données
            </h1>
            <p className="text-gray-600">
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Résumé statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Points 3D</p>
                  <p className="text-2xl font-bold text-blue-900">{data3D.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-600">Points 2D</p>
                  <p className="text-2xl font-bold text-green-900">{data2D.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-600">Résultats</p>
                  <p className="text-2xl font-bold text-purple-900">{tableData.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyse des données */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analyse Statistique
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Données 3D</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Moyenne X: {(data3D.reduce((acc, p) => acc + p.x, 0) / data3D.length).toFixed(2)}</p>
                  <p>Moyenne Y: {(data3D.reduce((acc, p) => acc + p.y, 0) / data3D.length).toFixed(2)}</p>
                  <p>Moyenne Z: {(data3D.reduce((acc, p) => acc + p.z, 0) / data3D.length).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Résultats</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Actifs: {tableData.filter(r => r.status === 'active').length}</p>
                  <p>En attente: {tableData.filter(r => r.status === 'pending').length}</p>
                  <p>Inactifs: {tableData.filter(r => r.status === 'inactive').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des top résultats */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top 10 Résultats
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                      Nom
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                      Catégorie
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                      Valeur
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-sm">{row.name}</td>
                      <td className="px-4 py-2 text-sm">{row.category}</td>
                      <td className="px-4 py-2 text-sm font-mono">{row.value.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm capitalize">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Options d'export</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Le PDF inclut un résumé complet des données</p>
            <p>• Format A4 optimisé pour l'impression</p>
            <p>• Métadonnées intégrées pour l'archivage</p>
            <p>• Compatible avec tous les lecteurs PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};