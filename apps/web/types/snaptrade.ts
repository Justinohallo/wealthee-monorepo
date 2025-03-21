// Define interface for brokerage data
export interface SnapTradeBrokerageAuthorization {
  id: string;
  created_date: string;
  updated_date: string;
  name: string;
  type: string;
  disabled: boolean;
  brokerage: {
    id: string;
    name: string;
    description: string;
    slug: string;
    display_name: string;
    aws_s3_logo_url: string;
  };
}
