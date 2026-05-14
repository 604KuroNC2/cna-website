<?php
defined('ABSPATH') || exit;

/* ─────────────────────────────────────────────────────────────
   SPEC VISIBILITY — stored in wp_options as JSON
───────────────────────────────────────────────────────────── */
function cna_default_spec_visibility(): array {
    return [
        'Wattage (W)'               => ['label'=>'Wattage',                'visible'=>true,  'group'=>'Performance'],
        'Voltage (V)'               => ['label'=>'Voltage',                'visible'=>true,  'group'=>'Performance'],
        'Lumens (lm)'               => ['label'=>'Lumens',                 'visible'=>true,  'group'=>'Performance'],
        'Efficiency'                => ['label'=>'Efficacy (lm/W)',        'visible'=>true,  'group'=>'Performance'],
        'L70 Rated Life (Hrs)'      => ['label'=>'Rated Life (L70)',       'visible'=>true,  'group'=>'Performance'],
        'Bulb Equivalent'           => ['label'=>'Replaces',               'visible'=>true,  'group'=>'Performance'],
        'Base'                      => ['label'=>'Base Type',              'visible'=>true,  'group'=>'Performance'],
        'Colour Temperature'        => ['label'=>'Colour Temperature',     'visible'=>true,  'group'=>'Performance'],
        'Beam Angle'                => ['label'=>'Beam Angle',             'visible'=>true,  'group'=>'Performance'],
        'CRI'                       => ['label'=>'CRI',                    'visible'=>true,  'group'=>'Performance'],
        'Dimmable'                  => ['label'=>'Dimmable',               'visible'=>true,  'group'=>'Performance'],
        'Operating Temperature'     => ['label'=>'Operating Temperature',  'visible'=>true,  'group'=>'Ratings'],
        'Environmental Rating'      => ['label'=>'Environmental Rating',   'visible'=>true,  'group'=>'Ratings'],
        'Certifications'            => ['label'=>'Certifications',         'visible'=>true,  'group'=>'Ratings'],
        '2-HR Fire Rating Compliance'=>['label'=>'2-HR Fire Rating',       'visible'=>true,  'group'=>'Ratings'],
        'Length (mm)'               => ['label'=>'Length (mm)',            'visible'=>false, 'group'=>'Dimensions'],
        'Length (inches)'           => ['label'=>'Length',                 'visible'=>true,  'group'=>'Dimensions'],
        'Width (mm)'                => ['label'=>'Width (mm)',             'visible'=>false, 'group'=>'Dimensions'],
        'Width (inches)'            => ['label'=>'Width',                  'visible'=>true,  'group'=>'Dimensions'],
        'Height (mm)'               => ['label'=>'Height (mm)',            'visible'=>false, 'group'=>'Dimensions'],
        'Height (inches)'           => ['label'=>'Height',                 'visible'=>true,  'group'=>'Dimensions'],
        'Diameter (mm)'             => ['label'=>'Diameter (mm)',          'visible'=>false, 'group'=>'Dimensions'],
        'Diameter (inches)'         => ['label'=>'Diameter',               'visible'=>true,  'group'=>'Dimensions'],
        'Weight (g)'                => ['label'=>'Weight (g)',             'visible'=>false, 'group'=>'Dimensions'],
        'Weight (lbs)'              => ['label'=>'Weight (lbs)',           'visible'=>true,  'group'=>'Dimensions'],
        'Inside Diameter'           => ['label'=>'Inside Diameter',        'visible'=>false, 'group'=>'Dimensions'],
        'Outside Diameter'          => ['label'=>'Outside Diameter',       'visible'=>false, 'group'=>'Dimensions'],
        'Nominal Length'            => ['label'=>'Nominal Length',         'visible'=>false, 'group'=>'Dimensions'],
        'Shape'                     => ['label'=>'Shape / Type',           'visible'=>true,  'group'=>'Physical'],
        'Finish'                    => ['label'=>'Finish',                 'visible'=>true,  'group'=>'Physical'],
        'Dimmer Compatibility'      => ['label'=>'Dimmer Compatibility',   'visible'=>true,  'group'=>'Physical'],
        'Mounting'                  => ['label'=>'Mounting',               'visible'=>true,  'group'=>'Physical'],
        'Diffuser Type'             => ['label'=>'Diffuser Type',          'visible'=>true,  'group'=>'Physical'],
        'Diffuser Material'         => ['label'=>'Diffuser Material',      'visible'=>false, 'group'=>'Physical'],
        'Hole Size Cutout'          => ['label'=>'Cutout Size',            'visible'=>true,  'group'=>'Physical'],
        'Flange Dimensions'         => ['label'=>'Flange Dimensions',      'visible'=>false, 'group'=>'Physical'],
        'Recess Dimensions'         => ['label'=>'Recess Depth',           'visible'=>false, 'group'=>'Physical'],
        'Rib-reinforced'            => ['label'=>'Rib-Reinforced',         'visible'=>false, 'group'=>'Physical'],
        'Warranty'                  => ['label'=>'Warranty',               'visible'=>true,  'group'=>'General'],
        'Direct Replacement For'    => ['label'=>'Replaces (Direct)',      'visible'=>false, 'group'=>'General'],
        'Use'                       => ['label'=>'Application',            'visible'=>true,  'group'=>'General'],
        'Surge Protection'          => ['label'=>'Surge Protection',       'visible'=>false, 'group'=>'General'],
        'Optional Accessory'        => ['label'=>'Optional Accessories',   'visible'=>false, 'group'=>'General'],
        'PIR Sensor'                => ['label'=>'PIR Sensor',             'visible'=>false, 'group'=>'General'],
        'Auto Shut-off'             => ['label'=>'Auto Shut-off',          'visible'=>false, 'group'=>'General'],
        'Waterproofing'             => ['label'=>'Waterproofing',          'visible'=>false, 'group'=>'General'],
        'LED Quantity'              => ['label'=>'LED Quantity',           'visible'=>false, 'group'=>'Technical'],
        'LED Type'                  => ['label'=>'LED Type',               'visible'=>false, 'group'=>'Technical'],
        'Input Voltage (VAC)'       => ['label'=>'Input Voltage',          'visible'=>false, 'group'=>'Technical'],
        'Current Draw'              => ['label'=>'Current Draw',           'visible'=>false, 'group'=>'Technical'],
        'Output Voltage (VDC)'      => ['label'=>'Output Voltage',         'visible'=>false, 'group'=>'Technical'],
        'Maximum Linkable Length'   => ['label'=>'Max Linkable Length',    'visible'=>false, 'group'=>'Technical'],
        'Classification Type'       => ['label'=>'Classification',         'visible'=>false, 'group'=>'Technical'],
        'Driver Dimensions (mm)'    => ['label'=>'Driver Dimensions (mm)', 'visible'=>false, 'group'=>'Technical'],
        'DriverDimensions (Inches)' => ['label'=>'Driver Dimensions',      'visible'=>false, 'group'=>'Technical'],
    ];
}

function cna_get_spec_visibility(): array {
    $stored = get_option('cna_spec_visibility');
    if ($stored) {
        $parsed = json_decode($stored, true);
        if (is_array($parsed)) return $parsed;
    }
    return cna_default_spec_visibility();
}

/* ─────────────────────────────────────────────────────────────
   SPEC VISIBILITY ADMIN PAGE
───────────────────────────────────────────────────────────── */
function cna_spec_visibility_page(): void {
    $specs = cna_get_spec_visibility();

    // Save
    if (isset($_POST['cna_save_specs']) && check_admin_referer('cna_spec_visibility_nonce')) {
        $new_specs = $specs;
        foreach ($new_specs as $key => &$cfg) {
            $cfg['visible'] = isset($_POST['spec_visible'][$key]);
        }
        unset($cfg);
        update_option('cna_spec_visibility', json_encode($new_specs));
        $specs = $new_specs;
        echo '<div class="notice notice-success"><p>Spec visibility saved.</p></div>';
    }

    // Reset
    if (isset($_POST['cna_reset_specs']) && check_admin_referer('cna_spec_visibility_nonce')) {
        delete_option('cna_spec_visibility');
        $specs = cna_default_spec_visibility();
        echo '<div class="notice notice-success"><p>Reset to defaults.</p></div>';
    }

    $groups = ['Performance','Ratings','Dimensions','Physical','General','Technical'];
    $group_colors = [
        'Performance' => '#2563eb','Ratings'  => '#16a34a','Dimensions' => '#9333ea',
        'Physical'    => '#ea580c','General'  => '#4b5563','Technical'  => '#dc2626',
    ];

    $visible_count = count(array_filter($specs, fn($s) => $s['visible']));
    $total_count   = count($specs);
    ?>
    <div class="wrap">
      <h1 style="font-family:'Barlow Condensed',sans-serif;font-size:2rem;color:#000080">
        Spec Visibility
        <span style="font-size:1rem;font-weight:normal;color:#6b7280;margin-left:12px">
          <?php echo $visible_count; ?> of <?php echo $total_count; ?> specs visible on product pages
        </span>
      </h1>
      <p class="description">Toggle which specifications appear on product detail pages. Changes apply immediately.</p>

      <form method="post" style="margin-top:16px">
        <?php wp_nonce_field('cna_spec_visibility_nonce'); ?>
        <div style="background:white;border:1px solid #c3c4c7;border-radius:4px;padding:16px;margin-bottom:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
          <input type="submit" name="cna_save_specs" value="Save Changes" class="button button-primary"
                 style="background:#000080;border-color:#000060" />
          <input type="submit" name="cna_reset_specs" value="Reset to Defaults" class="button button-secondary"
                 onclick="return confirm('Reset all spec visibility to defaults?')" />
        </div>

        <div style="display:flex;flex-direction:column;gap:16px">
          <?php foreach ($groups as $group):
            $group_specs = array_filter($specs, fn($s) => $s['group'] === $group);
            if (!$group_specs) continue;
            $color = $group_colors[$group] ?? '#374151';
            $vis   = count(array_filter($group_specs, fn($s) => $s['visible']));
          ?>
            <div style="border:1px solid #e5e7eb;border-radius:4px;overflow:hidden">
              <div style="background:<?php echo esc_attr($color); ?>;padding:10px 16px;display:flex;align-items:center;justify-content:space-between">
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1.1rem;color:white;text-transform:uppercase;letter-spacing:0.05em">
                  <?php echo esc_html($group); ?>
                </span>
                <span style="color:rgba(255,255,255,0.6);font-size:13px"><?php echo $vis; ?>/<?php echo count($group_specs); ?> visible</span>
              </div>
              <table class="widefat" style="border:none">
                <tbody>
                  <?php foreach ($group_specs as $key => $cfg): ?>
                    <tr>
                      <td style="padding:8px 16px;font-weight:600;font-size:13px;color:#374151;width:45%">
                        <?php echo esc_html($cfg['label']); ?>
                        <span style="font-weight:400;color:#9ca3af;font-size:11px">(<?php echo esc_html($key); ?>)</span>
                      </td>
                      <td style="padding:8px 16px">
                        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                          <input type="checkbox" name="spec_visible[<?php echo esc_attr($key); ?>]" value="1"
                                 <?php checked($cfg['visible']); ?> />
                          <span style="font-size:13px;color:<?php echo $cfg['visible'] ? '#16a34a' : '#9ca3af'; ?>">
                            <?php echo $cfg['visible'] ? 'Visible' : 'Hidden'; ?>
                          </span>
                        </label>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>
          <?php endforeach; ?>
        </div>

        <div style="margin-top:16px;background:white;border:1px solid #c3c4c7;border-radius:4px;padding:16px">
          <input type="submit" name="cna_save_specs" value="Save Changes" class="button button-primary"
                 style="background:#000080;border-color:#000060" />
        </div>
      </form>
    </div>
    <?php
}
