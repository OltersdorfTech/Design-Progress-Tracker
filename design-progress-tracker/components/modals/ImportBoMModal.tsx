import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { BoMItem } from '../../types';

interface ImportBoMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Omit<BoMItem, 'id'>[]) => void;
}

// Simple CSV parser that handles quoted fields
const parseCSV = (text: string): { headers: string[], rows: string[][] } => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["\s]/g, ''));
  const rows = lines.slice(1).map(line => {
    return line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
  });
  return { headers, rows };
};

// FIX: Refactored function to correctly map various CSV headers to BoMItem properties, fixing type errors.
const mapRowToBoMItem = (row: string[], headers: string[]): Omit<BoMItem, 'id'> => {
  const item: any = {};
  
  // Map from various CSV header possibilities (normalized) to BoMItem properties
  const headerMapping: { [key: string]: keyof Omit<BoMItem, 'id'> } = {
    'partnumber': 'partNumber',
    'pn': 'partNumber',
    'rev': 'revision',
    'revision': 'revision',
    'name': 'name',
    'title': 'name',
    'description': 'description',
    'desc': 'description',
    'category': 'category',
    'type': 'category',
    'weight': 'weight',
    'mass': 'weight',
    'cost': 'cost',
    'price': 'cost',
  };
  
  headers.forEach((header, index) => {
    const propName = headerMapping[header];
    if (propName) {
      item[propName] = row[index];
    }
  });

  return {
    partNumber: item.partNumber || 'N/A',
    revision: item.revision || 'A',
    name: item.name || 'Unnamed Part',
    description: item.description || '',
    category: item.category || 'Uncategorized',
    weight: parseFloat(item.weight) || 0,
    cost: parseFloat(item.cost) || 0,
  };
};


const ImportBoMModal: React.FC<ImportBoMModalProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Omit<BoMItem, 'id'>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setParsedData([]);
      
      try {
        const text = await selectedFile.text();
        const { headers, rows } = parseCSV(text);
        
        if (rows.length === 0) {
            setError("CSV file appears to be empty or invalid.");
            return;
        }

        const data = rows.map(row => mapRowToBoMItem(row, headers));
        setParsedData(data);
      } catch (err) {
          setError("Failed to parse CSV file. Please check its format.");
      }
    }
  };

  const handleSubmit = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Bill of Materials (BoM)">
      <div className="space-y-4">
        <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-md border border-gray-700">
            <p className="font-semibold text-gray-300 mb-1">CSV Format Instructions:</p>
            <p>Your file must have a header row. Column names are flexible (e.g., 'Part Number', 'pn', 'part_number' are all fine).</p>
            <p className="mt-2"><strong>Required Headers:</strong> `partNumber`, `name`</p>
            <p><strong>Optional Headers:</strong> `revision`, `description`, `category`, `weight`, `cost`</p>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        {parsedData.length > 0 && (
            <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Data Preview ({parsedData.length} items)</h4>
                <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-md">
                    <table className="w-full text-xs text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                            <tr>
                                <th className="px-3 py-2">Part #</th>
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parsedData.slice(0, 5).map((item, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                    <td className="px-3 py-2">{item.partNumber}</td>
                                    <td className="px-3 py-2">{item.name}</td>
                                    <td className="px-3 py-2">${item.cost.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {parsedData.length > 5 && <p className="text-center text-xs text-gray-500 p-2 bg-gray-800">...and {parsedData.length - 5} more rows.</p>}
                </div>
            </div>
        )}

      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={handleSubmit} disabled={parsedData.length === 0}>
          Import
        </Button>
      </div>
    </Modal>
  );
};

export default ImportBoMModal;