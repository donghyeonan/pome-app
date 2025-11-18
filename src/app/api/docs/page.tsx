'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Pome API Documentation</h1>
        <div className="bg-card rounded-lg shadow-lg p-6">
          <SwaggerUI url="/openapi.json" />
        </div>
      </div>
    </div>
  );
}
