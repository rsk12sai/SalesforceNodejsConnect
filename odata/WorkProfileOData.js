const { ODataServer, Edm, odata } = require('odata-v4-server');
const axios = require('axios');

/**
 * Entity definition (what Salesforce Connect will see)
 */
class WorkProfile {
  @Edm.Key
  @Edm.String
  ExternalId;

  @Edm.String
  CustomerName;

  @Edm.String
  Status;

  @Edm.Int32
  TodayRevenue;

  @Edm.Int32
  TodayTarget;

  @Edm.String
  SyncStatus;
}

/**
 * Controller: how OData returns data
 */
@odata.type(WorkProfile)
class WorkProfilesController {
  /**
   * GET /WorkProfiles
   */
  @odata.GET
  async find(req) {
    // You can call your existing REST endpoint
    const baseUrl = process.env.BASE_URL || 'https://salesforcenodejsconnect.onrender.com';
    const res = await axios.get(`${baseUrl}/api/readBulkTestProfiles`);
    const rows = Array.isArray(res.data) ? res.data : [];

    // Map REST -> OData fields
    let mapped = rows.map(r => ({
      ExternalId: String(r.externalId || ''),
      CustomerName: r.customerName || null,
      Status: r.status || null,
      TodayRevenue: Number.isFinite(r.todayRevenue) ? r.todayRevenue : null,
      TodayTarget: Number.isFinite(r.todayTarget) ? r.todayTarget : null,
      SyncStatus: r.syncStatus || null
    }));

    // Basic OData query options support (helpful for performance)
    // $top, $skip
    const top = parseInt(req.query?.$top, 10);
    const skip = parseInt(req.query?.$skip, 10);

    if (!Number.isNaN(skip) && skip > 0) mapped = mapped.slice(skip);
    if (!Number.isNaN(top) && top > 0) mapped = mapped.slice(0, top);

    return mapped;
  }

  /**
   * GET /WorkProfiles('BULK_EMP_1')
   */
  @odata.GET
  async findOne(@odata.key key) {
    const baseUrl = process.env.BASE_URL || 'https://salesforcenodejsconnect.onrender.com';
    const res = await axios.get(`${baseUrl}/api/readBulkTestProfiles`);
    const rows = Array.isArray(res.data) ? res.data : [];

    const r = rows.find(x => String(x.externalId) === String(key));
    if (!r) return null;

    return {
      ExternalId: String(r.externalId || ''),
      CustomerName: r.customerName || null,
      Status: r.status || null,
      TodayRevenue: Number.isFinite(r.todayRevenue) ? r.todayRevenue : null,
      TodayTarget: Number.isFinite(r.todayTarget) ? r.todayTarget : null,
      SyncStatus: r.syncStatus || null
    };
  }
}

/**
 * OData Server
 */
@odata.controller(WorkProfilesController, true)
class WorkProfileODataServer extends ODataServer {}

module.exports = WorkProfileODataServer;
