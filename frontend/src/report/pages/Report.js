import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ReportTable from '../components/ReportTable';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Report = () => {
  const [loadedReport, setLoadedReport] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const token = useParams();
  useEffect(() => {
    const fetchReport = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/reports/`,
          "GET",
          null,
          { Authorization: `Bearer ${userData.token}` },
        )
        console.log(responseData)
        setLoadedReport(responseData);
      } catch (err) { }
    };
    fetchReport();
  }, [sendRequest, token]);

  const handlePdfUpload = async (reportId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/reports/${reportId}/pdf`,
        'GET',
        null,
        {
          Authorization: `Bearer ${userData.token}`,
          FileName: `${reportId}.pdf`,
          ContentType: "application/pdf",
        },
      );

      console.log(response)

    } catch (err) {
      console.log('Error fetching PDF:', err);
    }
  };



  const reportDeletedHandler = async (deletedInvetoryId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/reports/${deletedInvetoryId}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        }
      );
      console.log('Report deleted:', responseData);
      setLoadedReport((prevReport) =>
        prevReport.filter(report => report._id !== deletedInvetoryId)
      );
    } catch (err) {
      console.log('Error deleting equipment:', err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedReport && (
        <ReportTable items={loadedReport} onReportDelete={reportDeletedHandler} handlePdfUpload={handlePdfUpload} />
      )}
    </React.Fragment>
  );
};

export default Report;
