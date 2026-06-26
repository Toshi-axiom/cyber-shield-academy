-- Seed default flags for all updated V2.0 lab modules
DELETE FROM public.lab_flags;

INSERT INTO public.lab_flags (module_id, flag_value, xp_reward) VALUES
  ('df-1', 'FLAG{comp_sys_arch_fund}', 50),
  ('df-2', 'FLAG{net_tech_protocol_ok}', 50),
  ('pn-1', 'FLAG{py_script_port_scan}', 50),
  ('pn-2', 'FLAG{p4ck3t_d3t3ct1v4_sh13ld}', 50),
  ('hb-1', 'FLAG{nm4p_scan_n3tw0rk}', 50),
  ('sa-1', 'FLAG{sh3ll_surv1v4l_compl3t3}', 50),
  ('was-1', 'FLAG{ow4sp_top10_sh0p_h4ck}', 50),
  ('eh-1', 'FLAG{r00t_priv3sc_succ3ss}', 50),
  ('ad-1', 'FLAG{ad_domain_compromise_xp}', 50),
  ('ccd-1', 'FLAG{k8s_pod_escap3_clust3r}', 50),
  ('ds-1', 'FLAG{soc_op3r4t1ons_m3tr1cs}', 50),
  ('ds-2', 'FLAG{si3m_sigma_rule_tun1ng}', 50),
  ('ds-3', 'FLAG{th3at_hunt_inc1d3nt_rep}', 50),
  ('ds-4', 'FLAG{soc_metrics_optimized_77}', 50),
  ('ds-5', 'FLAG{purple_team_adversary_emul}', 50),
  ('st-1', 'FLAG{malware_re_ghidra_decode}', 50),
  ('st-2', 'FLAG{mem_forensics_volatility_root}', 50),
  ('st-3', 'FLAG{firmw4r3_extrd_q3mu}', 50),
  ('ai-1', 'FLAG{llm_j41lbr34k_sucess}', 50),
  ('grc-1', 'FLAG{grc_risk_assessment_audit}', 50),
  ('cca-1', 'FLAG{p0rtf0l10_succ3ss_c4r33r}', 50)
ON CONFLICT (module_id) DO UPDATE 
SET flag_value = EXCLUDED.flag_value, xp_reward = EXCLUDED.xp_reward;
