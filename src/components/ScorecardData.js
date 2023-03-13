const ScorecardData = [
  {
    id: 'CONTINUITY-0001',
    category: 'CONTINUITY',
    summary: 'Data continuity',
    milestone: 'Field Trial',
    source: 'SRE',
    relative_url: 'acs/CONTINUITY-0001-data-continuity.md'
  },
  {
    id: 'CONTINUITY-0002',
    category: 'CONTINUITY',
    summary: 'Disaster Recovery',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/CONTINUITY-0002-disaster-recovery-plan.md'
  },
  {
    id: 'CONTINUITY-0003',
    category: 'CONTINUITY',
    summary: 'Data Management',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/CONTINUITY-0003-data-management.md'
  },
  {
    id: 'INCIDENT-MGMT-0001',
    category: 'INCIDENT-MGMT',
    summary: 'Contact information',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0001-contact-information.md'
  },
  {
    id: 'INCIDENT-MGMT-0002',
    category: 'INCIDENT-MGMT',
    summary: 'Service Description',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0002-service-description.md'
  },
  {
    id: 'INCIDENT-MGMT-0003',
    category: 'INCIDENT-MGMT',
    summary: 'Provide metadata for your service',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0003-provide-metadata-for-your-service.md'
  },
  {
    id: 'INCIDENT-MGMT-0004',
    category: 'INCIDENT-MGMT',
    summary: 'Service Escalation policies',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0004-service-escalation-policies.md'
  },
  {
    id: 'INCIDENT-MGMT-0005',
    category: 'INCIDENT-MGMT',
    summary: 'Documented internal and external dependencies',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0005-documented-internal-and-external-dependencies.md'
  },
  {
    id: 'INCIDENT-MGMT-0006',
    category: 'INCIDENT-MGMT',
    summary: 'Ability to map a container image tag to a code version',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0006-ability-to-map-a-container-image-tag-to-a-code-version.md'
  },
  {
    id: 'INCIDENT-MGMT-0007',
    category: 'INCIDENT-MGMT',
    summary: 'Known failure scenarios have an SOP',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0007-known-failure-scenarios-have-an-sop.md'
  },
  {
    id: 'INCIDENT-MGMT-0008',
    category: 'INCIDENT-MGMT',
    summary: 'CEE and SRE are enabled to support the workload',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/INCIDENT-MGMT-0008-cee-and-sre-are-enabled-to-support-the-workload.md'
  },
  {
    id: 'OBSERVABILITY-0001',
    category: 'OBSERVABILITY',
    summary: 'Service implements SRE observability requirements',
    milestone: 'Field Trial',
    source: 'SRE',
    relative_url: 'acs/OBSERVABILITY-0001-service-implements-sre-observability-requirements.md'
  },
  {
    id: 'OBSERVABILITY-0002',
    category: 'OBSERVABILITY',
    summary: 'Service defines and tracks SLOs',
    milestone: 'Field Trial',
    source: 'SRE',
    relative_url: 'acs/OBSERVABILITY-0002-service-defines-and-tracks-slos.md'
  },
  {
    id: 'OBSERVABILITY-0003',
    category: 'OBSERVABILITY',
    summary: 'SLO driven alerts with SOPs',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/OBSERVABILITY-0003-slo-driven-alerts-with-sops.md'
  },
  {
    id: 'OBSERVABILITY-0004',
    category: 'OBSERVABILITY',
    summary: 'Grafana dashboard for SLIs and SLOs',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/OBSERVABILITY-0004-grafana-dashboard-for-slis-and-slos.md'
  },
  {
    id: 'OBSERVABILITY-0005',
    category: 'OBSERVABILITY',
    summary: 'Logging',
    milestone: 'Field Trial',
    source: 'SRE',
    relative_url: 'acs/OBSERVABILITY-0005-logging.md'
  },
  {
    id: 'OBSERVABILITY-0006',
    category: 'OBSERVABILITY',
    summary: 'Error Budget Policy',
    milestone: 'General Availability',
    source: 'SRE',
    relative_url: 'acs/OBSERVABILITY-0006-error-budget-policy.md'
  },
  {
    id: 'RELEASING-0001',
    category: 'RELEASING',
    summary: 'Release process',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/RELEASING-0001-release-process.md'
  },
  {
    id: 'RELEASING-0002',
    category: 'RELEASING',
    summary: 'No moving tags for images',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/RELEASING-0002-no-moving-tags-for-images.md'
  },
  {
    id: 'RELEASING-0003',
    category: 'RELEASING',
    summary: 'Staging and Production environments',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/RELEASING-0003-staging-and-production-environments.md'
  },
  {
    id: 'RELEASING-0004',
    category: 'RELEASING',
    summary: 'Automated and repeatable release process',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELEASING-0004-automated-and-repeatable-release-process.md'
  },
  {
    id: 'RELEASING-0005',
    category: 'RELEASING',
    summary: 'Gating promotion to production against testing in staging',
    milestone: 'General Availability',
    source: 'SRE',
    relative_url: 'acs/RELEASING-0005-gating-promotion-to-production-against-testing-in-staging.md'
  },
  {
    id: 'RELIABILITY-0001',
    category: 'RELIABILITY',
    summary: 'Service runs on OpenShift Dedicated',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0001-service-runs-on-openshift-dedicated.md'
  },
  {
    id: 'RELIABILITY-0002',
    category: 'RELIABILITY',
    summary: 'Define requests and limits',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0002-define-requests-and-limits.md'
  },
  {
    id: 'RELIABILITY-0003',
    category: 'RELIABILITY',
    summary: 'Dependency-management plan',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0003-dependency-management-plan.md'
  },
  {
    id: 'RELIABILITY-0004',
    category: 'RELIABILITY',
    summary: 'Customer brought SSL Certificate policies',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0004-customer-brought-ssl-certificate-policies.md'
  },
  {
    id: 'RELIABILITY-0005',
    category: 'RELIABILITY',
    summary: 'Kube API considerations',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0005-kube-api-considerations.md'
  },
  {
    id: 'RELIABILITY-0006',
    category: 'RELIABILITY',
    summary: 'Horizontally scalable',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0006-horizontally-scalable.md'
  },
  {
    id: 'RELIABILITY-0007',
    category: 'RELIABILITY',
    summary: 'Kubernetes best practices for resiliency',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0007-kubernetes-best-practices-for-resiliency.md'
  },
  {
    id: 'RELIABILITY-0008',
    category: 'RELIABILITY',
    summary: 'Service tolerant to OSD upgrades without disruption',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0008-service-tolerant-to-osd-upgrades-without-disruption.md'
  },
  {
    id: 'RELIABILITY-0009',
    category: 'RELIABILITY',
    summary: 'Load and stress testing',
    milestone: 'General Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0009-load-and-stress-testing.md'
  },
  {
    id: 'RELIABILITY-0010',
    category: 'RELIABILITY',
    summary: 'Life-cycle tests',
    milestone: 'General Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0010-life-cycle-tests.md'
  },
  {
    id: 'RELIABILITY-0011',
    category: 'RELIABILITY',
    summary: 'Capacity plan including scalability constraints',
    milestone: 'General Availability',
    source: 'SRE',
    relative_url: 'acs/RELIABILITY-0011-capacity-plan-including-scalability-constraints.md'
  },
  {
    id: 'ROMS-1000',
    category: 'INCIDENT-MGMT',
    summary: 'Executive Approval',
    milestone: 'Service Preview',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1000-executive-approval.md'
  },
  {
    id: 'ROMS-1005',
    category: 'INCIDENT-MGMT',
    summary: 'Initial budget',
    milestone: 'Service Preview',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1005-initial-budget.md'
  },
  {
    id: 'ROMS-1018',
    category: 'RELIABILITY',
    summary: 'Upgrade Strategy',
    milestone: 'Limited Availability',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1018-upgrade-strategy.md'
  },
  {
    id: 'ROMS-1129',
    category: 'INCIDENT-MGMT',
    summary: 'Finalize Support Plan, Escalation Path and Engagement Plan',
    milestone: 'Limited Availability',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1129-finalize-support-plan-escalation-path-and-engagement-plan.md'
  },
  {
    id: 'ROMS-1132',
    category: 'SECURITY',
    summary: 'Privacy Impact Assessment - InfoSec',
    milestone: 'Field Trial',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1132-privacy-impact-assessment-infosec.md'
  },
  {
    id: 'ROMS-1149',
    category: 'INCIDENT-MGMT',
    summary: 'status.redhat.com Integration',
    milestone: 'General Availability',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1149-status-redhat-com-integration.md'
  },
  {
    id: 'ROMS-1159',
    category: 'RELIABILITY',
    summary: 'SLA/SLI/SLO Final Acceptance',
    milestone: 'General Availability',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1159-sla-sli-slo-final-acceptance.md'
  },
  {
    id: 'ROMS-1203',
    category: 'RELIABILITY',
    summary: 'Operator Training & Strategy',
    milestone: 'Limited Availability',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1203-operator-training-strategy.md'
  },
  {
    id: 'ROMS-1207',
    category: 'RELIABILITY',
    summary: '60-Day Sea Trial Period',
    milestone: 'Limited Availability',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1207-60-day-sea-trial-period.md'
  },
  {
    id: 'ROMS-1217',
    category: 'INCIDENT-MGMT',
    summary: 'Architectural Summary',
    milestone: 'Service Preview',
    source: 'ROMS',
    relative_url: 'acs/ROMS-1217-architectural-summary.md'
  },
  {
    id: 'ROMS-2001',
    category: 'SECURITY',
    summary: 'Product Security Onboarding',
    milestone: 'Field Trial',
    source: 'ROMS',
    relative_url: 'acs/ROMS-2001-product-security-onboarding.md'
  },
  {
    id: 'ROMS-3002',
    category: 'SECURITY',
    summary: 'Enterprise Security Standard - InfoSec',
    milestone: 'Field Trial',
    source: 'ROMS',
    relative_url: 'acs/ROMS-3002-enterprise-security-standard-infosec.md'
  },
  {
    id: 'ROMS-3003',
    category: 'SECURITY',
    summary: 'Onboard the Managed Service to CPaaS/Managed Services Pipeline',
    milestone: 'Field Trial',
    source: 'ROMS',
    relative_url: 'acs/ROMS-3003-onboard-the-managed-service-to-cpaas-managed-services-pipeline.md'
  },
  {
    id: 'SECURITY-0001',
    category: 'SECURITY',
    summary: 'Delivery of secrets and rotation policies',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/SECURITY-0001-delivery-of-secrets-and-rotation-policies.md'
  },
  {
    id: 'SECURITY-0002',
    category: 'SECURITY',
    summary: 'Supply chain approved pipeline',
    milestone: 'Service Preview',
    source: 'SRE',
    relative_url: 'acs/SECURITY-0002-supply-chain-approved-pipeline.md'
  },
  {
    id: 'SECURITY-0003',
    category: 'SECURITY',
    summary: 'CVE Response process',
    milestone: 'Field Trial',
    source: 'SRE',
    relative_url: 'acs/SECURITY-0003-cve-response-process.md'
  },
  {
    id: 'SECURITY-0004',
    category: 'SECURITY',
    summary: 'Compliance requirements',
    milestone: 'Limited Availability',
    source: 'SRE',
    relative_url: 'acs/SECURITY-0004-compliance-requirements.md'
  }
];

export default ScorecardData;
