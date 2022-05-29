export enum orderTypes {
    none = "none",
    normal = "normal",
    fast = "fast",
  };
  
export const TypeMapping: Record<orderTypes, string> = {
    [orderTypes.none]: "none",
    [orderTypes.normal]: "normal",
    [orderTypes.fast]: "fast",
};