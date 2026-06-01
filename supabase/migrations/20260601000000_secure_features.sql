-- Seed default flags for all lab modules
INSERT INTO public.lab_flags (module_id, flag_value, xp_reward) VALUES
  ('f-1', 'FLAG{sh3ll_surv1v4l_compl3t3}', 50),
  ('f-2', 'FLAG{p4ck3t_d3t3ct1v4_sh13ld}', 50),
  ('o-1', 'FLAG{f00tpr1nt_recon_0s1nt}', 50),
  ('o-2', 'FLAG{nm4p_scan_n3tw0rk}', 50),
  ('o-3', 'FLAG{r00t_priv3sc_succ3ss}', 50),
  ('c-1', 'FLAG{p4dd1ng_0r4cl3_c1ph3r}', 50),
  ('c-2', 'FLAG{tls_d0wngr4d3_s3cur3}', 50),
  ('c-3', 'FLAG{cr4ck_th3_v4ult_p4ss}', 50),
  ('w-1', 'FLAG{ow4sp_top10_sh0p_h4ck}', 50),
  ('w-2', 'FLAG{jwt_t0k3n_f0rg3ry_sec}', 50),
  ('cl-1', 'FLAG{aws_iam_esc4l4t10n}', 50),
  ('cl-2', 'FLAG{k8s_pod_escap3_clust3r}', 50),
  ('cl-3', 'FLAG{cicd_pip3l1n3_p01s0n}', 50),
  ('m-1', 'FLAG{apk_r3v3rs3_fr1d4_pin}', 50),
  ('m-2', 'FLAG{firmw4r3_extrd_q3mu}', 50),
  ('ai-1', 'FLAG{llm_j41lbr34k_sucess}', 50),
  ('ai-2', 'FLAG{ml_model_p01s0n_backd00r}', 50),
  ('s-1', 'FLAG{soc_op3r4t1ons_m3tr1cs}', 50),
  ('s-2', 'FLAG{si3m_sigma_rule_tun1ng}', 50),
  ('s-3', 'FLAG{th3at_hunt_inc1d3nt_rep}', 50),
  ('ca-1', 'FLAG{m0ck_scr33n_h1r3d}', 50),
  ('ca-2', 'FLAG{p0rtf0l10_succ3ss_c4r33r}', 50)
ON CONFLICT (module_id) DO UPDATE 
SET flag_value = EXCLUDED.flag_value, xp_reward = EXCLUDED.xp_reward;


-- 1. Complete Module Secure RPC
CREATE OR REPLACE FUNCTION public.complete_module_secure(p_module_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_inserted boolean := false;
  v_xp_total integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Try to insert module completion
  INSERT INTO public.user_progress (user_id, module_id)
  VALUES (v_user_id, p_module_id)
  ON CONFLICT (user_id, module_id) DO NOTHING;
  
  -- Check if insertion occurred
  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  IF v_inserted THEN
    -- Increment user XP
    UPDATE public.user_stats
    SET xp = xp + 50, updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  SELECT xp INTO v_xp_total FROM public.user_stats WHERE user_id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'awarded', v_inserted,
    'xp_earned', CASE WHEN v_inserted THEN 50 ELSE 0 END,
    'xp_total', coalesce(v_xp_total, 0)
  );
END;
$$;


-- 2. Submit Lab Flag Secure RPC
CREATE OR REPLACE FUNCTION public.submit_lab_flag_secure(p_module_id text, p_flag text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_correct_flag text;
  v_xp_reward integer;
  v_flag_newly_captured boolean := false;
  v_module_newly_completed boolean := false;
  v_xp_earned integer := 0;
  v_xp_total integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Look up flag value
  SELECT flag_value, xp_reward INTO v_correct_flag, v_xp_reward
  FROM public.lab_flags
  WHERE module_id = p_module_id;

  IF v_correct_flag IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'No flag configured for this module.');
  END IF;

  -- Validate flag (case-insensitive, trimmed)
  IF lower(trim(p_flag)) != lower(trim(v_correct_flag)) THEN
    RETURN json_build_object('success', false, 'message', 'Incorrect flag value.');
  END IF;

  -- Insert/update lab progress
  INSERT INTO public.lab_progress (user_id, module_id, completed_steps, flag_captured, updated_at)
  VALUES (v_user_id, p_module_id, 100, true, now())
  ON CONFLICT (user_id, module_id) 
  DO UPDATE SET flag_captured = true, completed_steps = 100, updated_at = now()
  WHERE public.lab_progress.flag_captured = false;

  GET DIAGNOSTICS v_flag_newly_captured = ROW_COUNT;

  IF v_flag_newly_captured THEN
    v_xp_earned := v_xp_earned + v_xp_reward;
  END IF;

  -- Completing the flag also completes the module progress
  INSERT INTO public.user_progress (user_id, module_id)
  VALUES (v_user_id, p_module_id)
  ON CONFLICT (user_id, module_id) DO NOTHING;

  GET DIAGNOSTICS v_module_newly_completed = ROW_COUNT;

  IF v_module_newly_completed THEN
    v_xp_earned := v_xp_earned + 50; -- Standard module completion XP
  END IF;

  -- Award cumulative XP if any was earned
  IF v_xp_earned > 0 THEN
    UPDATE public.user_stats
    SET xp = xp + v_xp_earned, updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  SELECT xp INTO v_xp_total FROM public.user_stats WHERE user_id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Access Granted: Flag Captured!',
    'flag_newly_captured', v_flag_newly_captured,
    'module_newly_completed', v_module_newly_completed,
    'xp_earned', v_xp_earned,
    'xp_total', coalesce(v_xp_total, 0)
  );
END;
$$;


-- 3. Submit Quiz Secure RPC
CREATE OR REPLACE FUNCTION public.submit_quiz_secure(p_phase_id text, p_score integer, p_total integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_prev_max integer := 0;
  v_xp_earned integer := 0;
  v_xp_total integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Get previous high score
  SELECT coalesce(max(score), 0) INTO v_prev_max
  FROM public.quiz_results
  WHERE user_id = v_user_id AND phase_id = p_phase_id;

  -- Save attempt
  INSERT INTO public.quiz_results (user_id, phase_id, score, total)
  VALUES (v_user_id, p_phase_id, p_score, p_total);

  -- Award XP only for improvements
  IF p_score > v_prev_max THEN
    v_xp_earned := (p_score - v_prev_max) * 20;
    UPDATE public.user_stats
    SET xp = xp + v_xp_earned, updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  SELECT xp INTO v_xp_total FROM public.user_stats WHERE user_id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'xp_earned', v_xp_earned,
    'xp_total', coalesce(v_xp_total, 0)
  );
END;
$$;


-- 4. Sync Guest Progress Secure RPC
CREATE OR REPLACE FUNCTION public.sync_guest_progress_secure(p_module_ids text[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_module_id text;
  v_inserted boolean;
  v_xp_earned integer := 0;
  v_xp_total integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Loop through module IDs and insert them
  FOREACH v_module_id IN ARRAY p_module_ids
  LOOP
    INSERT INTO public.user_progress (user_id, module_id)
    VALUES (v_user_id, v_module_id)
    ON CONFLICT (user_id, module_id) DO NOTHING;

    GET DIAGNOSTICS v_inserted = ROW_COUNT;

    IF v_inserted THEN
      v_xp_earned := v_xp_earned + 50;
    END IF;
  END LOOP;

  -- Update XP once for all newly synced modules
  IF v_xp_earned > 0 THEN
    UPDATE public.user_stats
    SET xp = xp + v_xp_earned, updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  SELECT xp INTO v_xp_total FROM public.user_stats WHERE user_id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'xp_earned', v_xp_earned,
    'xp_total', coalesce(v_xp_total, 0)
  );
END;
$$;


-- 5. Revoke Client Write Permissions & Harden Security
-- Revoke direct inserts and updates on user_stats, user_progress, and lab_progress for authenticated role
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_progress FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.lab_progress FROM authenticated;

-- Ensure read operations are still permitted
GRANT SELECT ON public.user_stats TO authenticated;
GRANT SELECT ON public.user_progress TO authenticated;
GRANT SELECT ON public.lab_progress TO authenticated;

-- Drop obsolete update/insert policies on lab_progress
DROP POLICY IF EXISTS "Users can insert own lab progress" ON public.lab_progress;
DROP POLICY IF EXISTS "Users can update own lab progress" ON public.lab_progress;
